# Технические детали реализации

> Дополнение к `scenario.md`. Сценарий и баланс — там; здесь — MobX, SDK, localStorage.  
> **Общие техтребования и файлы данных:** `dev/technical_requirements.md`.  
> Игровой дизайн точек входа в авторизацию — `scenario.md` §12.

---

## 1. Стек и слои

| Слой | Технология | Роль |
|------|------------|------|
| UI | React + Vite + CSS | изба, книга, модалки |
| State | MobX | единый `GameStore` — источник правды в рантайме |
| Локальное сохранение | `localStorage` | гостевой режим, оффлайн-кэш, быстрый старт |
| Платформа | SDK Яндекс.Игр | авторизация, облако (`player.setData` / `getData`), реклама, покупки |
| Тест | `isTestMode` | заглушки SDK и мок авторизации |

**Поток данных:**

```
Действие игрока → MobX action → mutate state → SaveService.schedulePersist()
                                                      ├─ localStorage (всегда)
                                                      └─ cloud (если authorized)
```

---

## 2. MobX: `GameStore` и снимок сохранения

В рантайме — один root-store (или несколько связанных stores с единой точкой сериализации). Перед записью state сворачивается в plain-object `GameSave` (без observable-обёрток).

### 2.1. Поля `GameSave` (v1)

```typescript
interface GameSave {
  version: number;              // схема сохранения для миграций
  savedAt: number;              // Date.now(), ISO в логах

  // §4 scenario.md
  onboardingStep: number;       // 0–6, после онбординга = 'completed' → хранить как 6 + флаг
  isFirstLaunch: boolean;
  firstChestOpened: boolean;

  // §7.1
  energy: number;
  maxEnergy: number;
  luckCoins: number;
  talismans: number;
  titleId: string | null;

  // §5 — духи и коллекции
  spiritStatuses: Record<string, 'available' | 'defeated' | 'locked'>;
  fragmentCounts: Record<string, number>;
  selectedFragmentSpiritId: string | null;
  skins: { cat: string; domovoy: string; izba: string; window: string };
  ownedSkinIds?: string[];      // профиль: что можно «Выбрать» (profile_layout.md §7)
  ownedTitleIds?: string[];
  trophiesUnlocked: string[];

  // §6, §5.4 — сундуки
  chestReadyAt: number | null;  // timestamp, null = готов
  wonderChestWeekSlotUsed: boolean;
  wonderChestClickProgress: number;
  wonderChestPityCounter: number;

  // §7.2, §7.3 — ивенты
  susedkoStealActive: boolean;
  zhirdyaySeenThisNight: boolean;

  // мета
  totalPlaySeconds?: number;    // для диалога выбора сохранения Яндекса
}
```

MobX-store держит те же поля; `toSave(): GameSave` и `hydrate(save: GameSave)` — единственные места маппинга.

### 2.2. Когда писать на диск

| Триггер | Действие |
|---------|----------|
| Любое значимое изменение (квест, сундук, клик с cap) | `schedulePersist()` с debounce **2–3 с** |
| `beforeunload` / `visibilitychange: hidden` | `flushPersist()` немедленно |
| После `player.setData` успеха | обновить `lastCloudSyncAt` в meta |

Не писать в localStorage на каждый клик по коту — только debounced batch.

---

## 3. localStorage (гостевой режим)

### 3.1. Ключ и формат

```typescript
const LOCAL_SAVE_KEY = 'slavic_myths_save_v1';

function readLocalSave(): GameSave | null {
  const raw = localStorage.getItem(LOCAL_SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameSave;
  } catch {
    return null;
  }
}

function writeLocalSave(save: GameSave): void {
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(save));
}
```

### 3.2. Правила

- **Всегда** пишем в localStorage — и для гостя, и для авторизованного (локальный кэш последнего state).
- При старте игры: сначала гидратация из localStorage (мгновенный UI), затем — при необходимости merge/replace из облака.
- При `localStorage` quota exceeded — лог + попытка урезать некритичные поля; не блокировать геймплей.
- Кнопка «Сбросить прогресс» в настройках — очищает ключ и (если авторизован) облако только после подтверждения.

---

## 4. Яндекс-авторизация и облачное сохранение

Документация SDK: [Данные игрока](https://yandex.ru/dev/games/doc/ru/sdk/sdk-player).

### 4.1. Инициализация

```typescript
let ysdk: YandexGames.SDK;

async function initPlatform(): Promise<void> {
  if (config.isTestMode) {
    ysdk = createMockYsdk();
    return;
  }
  ysdk = await YaGames.init();
}
```

### 4.2. Проверка и вызов авторизации

```typescript
async function ensurePlayer() {
  return ysdk.getPlayer();
}

async function isAuthorized(): Promise<boolean> {
  const player = await ensurePlayer();
  return player.isAuthorized();
}

/** Только по явному действию игрока (настройки, баннер после сундука) */
async function requestAuth(): Promise<boolean> {
  try {
    await ysdk.auth.openAuthDialog();
    return (await ensurePlayer()).isAuthorized();
  } catch {
    return false;
  }
}
```

Требования платформы: объяснить **зачем** вход (продолжить на другом устройстве), не вызывать диалог при каждом запуске.

### 4.3. Запись и чтение облака

```typescript
const CLOUD_SAVE_KEY = 'gameSave'; // одно поле в player.setData

async function loadCloudSave(): Promise<GameSave | null> {
  const player = await ensurePlayer();
  if (!player.isAuthorized()) return null;

  const data = await player.getData([CLOUD_SAVE_KEY]);
  return (data[CLOUD_SAVE_KEY] as GameSave) ?? null;
}

async function saveCloudSave(save: GameSave, flush = false): Promise<void> {
  const player = await ensurePlayer();
  if (!player.isAuthorized()) return;

  await player.setData({ [CLOUD_SAVE_KEY]: save }, flush);
}
```

- Лимит: **200 KB** на игрока — держать `GameSave` компактным (короткие id, без дублирования текстов квестов).
- `flush: true` — на `beforeunload` и после критичных действий (победа в квесте, открытие сундука).
- `flush: false` — обычный debounced autosave (очередь SDK).

### 4.4. Стратегия merge при загрузке

```typescript
async function bootstrapSave(): Promise<void> {
  const local = readLocalSave();
  const authorized = await isAuthorized();
  const cloud = authorized ? await loadCloudSave() : null;

  const save = pickBestSave(local, cloud); // по savedAt; при равенстве — cloud
  gameStore.hydrate(save ?? createDefaultSave());
}

function pickBestSave(a: GameSave | null, b: GameSave | null): GameSave | null {
  if (!a) return b;
  if (!b) return a;
  return a.savedAt >= b.savedAt ? a : b;
}
```

При **диалоге выбора аккаунта** Яндекса (гость → логин) платформа может показать своё окно. Подписаться на событие и перезагрузить state:

```typescript
ysdk.on(ysdk.EVENTS.ACCOUNT_SELECTION_DIALOG_CLOSED, async () => {
  const data = await (await ensurePlayer()).getData([CLOUD_SAVE_KEY]);
  const save = data[CLOUD_SAVE_KEY] as GameSave | undefined;
  if (save) gameStore.hydrate(save);
  writeLocalSave(gameStore.toSave());
});
```

### 4.5. `SaveService` (единая точка)

```typescript
class SaveService {
  private timer: ReturnType<typeof setTimeout> | null = null;

  schedulePersist() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flushPersist(), 2500);
  }

  async flushPersist() {
    const save = gameStore.toSave();
    save.savedAt = Date.now();
    writeLocalSave(save);
    if (await isAuthorized()) {
      await saveCloudSave(save, true);
    }
  }
}
```

---

## 5. SDK Яндекс.Игр (прочее)

| Возможность | Метод / сервис | Когда |
|-------------|----------------|-------|
| Rewarded-реклама | `ysdk.adv.showRewardedVideo` | §10 `scenario.md`; в тесте — заглушка |
| Покупки (Сундук чудес) | Payments API | продакшен |
| Лидерборды | не в MVP | — |
| `LoadingAPI.ready()` | после гидратации save | продакшен |

Реклама и покупки — отдельные обёртки (`yandexAdsService`, `yandexPaymentsService`), не смешивать с `SaveService`.

---

## 6. Тестовый режим (`isTestMode`)

```typescript
function createMockYsdk(): MockSDK {
  let authorized = false;
  return {
    getPlayer: async () => ({
      isAuthorized: () => authorized,
      getData: async () => (authorized ? { gameSave: readLocalSave() } : {}),
      setData: async (data) => {
        if (data.gameSave) writeLocalSave(data.gameSave as GameSave);
      },
    }),
    auth: {
      openAuthDialog: async () => {
        authorized = true; // или window.confirm для ручной проверки
      },
    },
    adv: { showRewardedVideo: ({ callbacks }) => callbacks.onRewarded() },
  };
}
```

В тесте облако = тот же localStorage под капотом мока; на проде — реальный `player.setData`.

---

## 7. Чеклист реализации

- [ ] `GameSave.version` и миграция при изменении схемы  
- [ ] Debounced persist + flush на уход со страницы  
- [ ] localStorage работает без SDK (гость)  
- [ ] `openAuthDialog` только по кнопке игрока  
- [ ] После авторизации — load cloud → hydrate → write local  
- [ ] Обработка `ACCOUNT_SELECTION_DIALOG_CLOSED`  
- [ ] Размер снимка < 50 KB (запас до лимита 200 KB)  
- [ ] В тесте мок SDK не требует сети  

---

*Версия: 1.0 · Техническое приложение к scenario.md v1.3*
