# Epic 16 — Мета-системы (draft global update)

> План: `instruction/plans/global-draft-update_f0876d6e.plan.md`. Канон механик: `instruction/plans/draft.md`.  
> Epic 13–15 и TASK-048 **не** менять статус без собственных gates.

## UX-спека (mockup-план)

| Зона | Поведение | Проверка |
|------|-----------|----------|
| Зеркало | Комната 1, справа от книги; до Яги — серое стекло, реплика кота, модалка не открывается; после — порог → сеанс на весь экран | visual_check |
| Ежедневка | Слева, компактный список из 2 пунктов; не перекрывает HUD; скрыта полностью после 43/43 фрагментов | visual_check |
| Лавка Яги | После первой победы над Ягой; вкладки «Крупицы» и «Свечи» (IAP); все товары видны сразу | visual_check |
| Профиль | Вкладки питомцев и магазинных эффектов; «Атмосфера» + `thunder_izba` без изменений | visual_check |

## Asset manifest (черновик, production после owner approval)

| Категория | Путь / fallback | Статус |
|-----------|-------------------|--------|
| Зеркало (комната) | `assets/izba/mirror_floor.png` | черновик: `instruction/design/drafts/mirror_floor_draft.png` |
| Зеркало (сеанс) | `assets/divination/mirror_session.png` | draft → production после visual-check |
| Дым сеанса | `assets/divination/smoke_overlay.png` | draft → production после visual-check |
| 7 скинов кота лавки | `assets/cat/skins/…` по `skinContent` | partial (Дымок/Волшебство есть) |
| 3 питомца | `assets/pets/{griffin,humpback,firebird}_*.png` | awaiting_user |
| 4 FX лавки | CSS-классы `izba-effect--fog` … `izba-effect--stars` | code-first + visual_check |

## SDK — свечи IAP

- Product id: `candle_pack_1` (`src/data/yagaShop.ts`).
- Цена и entitlement — только из `PaymentsService` / каталога платформы (яны).
- UI **не** показывает ₽; свечи начисляются **после** подтверждённого успешного платежа.

## Save v13 (контракт)

| Поле | Назначение |
|------|------------|
| `candles`, `truthCrumbs` | Ресурсы гадания / лавки |
| `candleGrantedSpiritIds` | +1 свеча за первую победу над духом |
| `dailyQuest*` | Календарный день, сказ, 100 кликов, викторина, выдача фрагмента |
| `ownedPetIds`, `equippedPetId` | Питомцы |
| `yagaShopPurchasedIds` | Идемпотентные покупки |

Фрагментный дроп: `src/domain/fragmentDrop.ts` — очередь `FRAGMENT_SPIRIT_ORDER`; `selectedFragmentSpiritId` только подсветка книги.
