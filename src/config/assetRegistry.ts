/**
 * Реестр путей ассетов — единственное место для правки путей в коде.
 * Спека: instruction/assets_catalog.md
 *
 * Резолв через Vite: `new URL(..., import.meta.url)`.
 * При смене файла на диске — править только строку path здесь.
 */

import type { Grade } from '../domain/grade';
import { GRADE_FOLDER } from '../domain/grade';

const fromAssets = (path: string): string =>
  new URL(`../../assets/${path}`, import.meta.url).href;

// --- Изба ---

export const houseSkins = {
  hut_standart: fromAssets('house/hut_standart.png'),
  hut_rate: fromAssets('house/hut_rate.png'),
  hut_the_age_of_miracles: fromAssets('house/hut_the_age_of_miracles.png'),
  hut_harmony: fromAssets('house/hut_harmony.png'),
  hut_cyberpank: fromAssets('house/hut_cyberpank.png'),
} as const;

export type HouseSkinId = keyof typeof houseSkins;

export const DEFAULT_HOUSE_SKIN: HouseSkinId = 'hut_standart';

// --- Вид из окна ---

export const viewSkins = {
  landscape_standart: fromAssets('view/landscape_standart.jpeg'),
  landscape_temnyy_les: fromAssets('view/landscape_temnyy_les.jpeg'),
  landscape_omut: fromAssets('view/landscape_omut.jpeg'),
  landscape_cyber_city: fromAssets('view/landscape_cyber_city.jpeg'),
  landscape_yaga: fromAssets('view/landscape_yaga.jpeg'),
} as const;

export type ViewSkinId = keyof typeof viewSkins;

export const DEFAULT_VIEW_SKIN: ViewSkinId = 'landscape_standart';

/** Фоны викторины (только квест; баня не в профиле) */
export const quizSceneBackgrounds = {
  banya: fromAssets('quiz/bg_banya.jpeg'),
  kikimoraCraft: fromAssets('quiz/kikimora_craft_bg.jpeg'),
  trophyTale: fromAssets('quiz/trophy_tale_bg.jpeg'),
} as const;

// --- Мебель ---

export type QuizLocationId =
  | 'izba'
  | 'banya'
  | 'les'
  | 'pole'
  | 'voda'
  | 'temnyy_les';

/** Фоны викторины — MVP fallback из house/view (quiz_layout.md §5) */
export type QuizBackgroundConfig = {
  src: string;
  filterClass: string;
  /** PNG избы поверх леса (стёкла с α пропускают view) */
  hutOverlay?: boolean;
};

export const quizBackgrounds: Record<QuizLocationId, QuizBackgroundConfig> = {
  izba: {
    src: houseSkins.hut_standart,
    filterClass: 'quiz-bg--izba',
    hutOverlay: true,
  },
  les: { src: viewSkins.landscape_standart, filterClass: 'quiz-bg--photo' },
  banya: { src: quizSceneBackgrounds.banya, filterClass: 'quiz-bg--photo' },
  pole: { src: viewSkins.landscape_standart, filterClass: 'quiz-bg--pole' },
  voda: { src: viewSkins.landscape_omut, filterClass: 'quiz-bg--photo' },
  temnyy_les: {
    src: viewSkins.landscape_temnyy_les,
    filterClass: 'quiz-bg--photo',
  },
};

export const izbaProps = {
  mirrorFloor: fromAssets('izba/mirror_floor.png'),
} as const;

export const furniture = {
  bake: fromAssets('furniture/bake.png'),
  bench: fromAssets('furniture/bench.png'),
  stand: fromAssets('furniture/stand.png'),
  bookClosed: fromAssets('furniture/book_of_spirits.png'),
  bookOpen: fromAssets('furniture/book_of_spirits_open.png'),
  boxClosed: fromAssets('furniture/box_closed.png'),
  boxOpen: fromAssets('furniture/box_open.png'),
  shelf: fromAssets('furniture/shelf.png'),
  starterCasket: fromAssets('furniture/starter_casket.png'),
  yardGrass: fromAssets('furniture/yard_grass.png'),
  kikimoraWeaving: fromAssets('furniture/kikimora_weaving.png'),
  /** ⏳ файла ещё нет — fallback на box + hue-rotate в UI */
  miracleChestClosed: fromAssets('furniture/box_closed.png'),
  miracleChestOpen: fromAssets('furniture/box_open.png'),
} as const;

// --- Враги ---

export const enemies = {
  fatso: fromAssets('enemy/fatso.png'),
  susedko: fromAssets('enemy/susedko.png'),
} as const;

// --- Домовой ---

export const brownieSkins = {
  brownie_standart: fromAssets('brownie/common/brownie_standart.png'),
  brownie_rate: fromAssets('brownie/rate/brownie_rate.png'),
  brownie_epic: fromAssets('brownie/epic/brownie_epic.png'),
  the_age_of_miracles_brownie: fromAssets(
    'brownie/the_age_of_miracles/the_age_of_miracles_brownie.png',
  ),
} as const;

export type BrownieSkinId = keyof typeof brownieSkins;

export const DEFAULT_BROWNIE_SKIN: BrownieSkinId = 'brownie_standart';

// --- Рамки грейда (HUD, профиль, сетка) ---

export const gradeFrames: Record<Grade, string> = {
  common: fromAssets('frame/common.png'),
  rare: fromAssets('frame/rate.png'),
  epic: fromAssets('frame/epic.png'),
  epoch: fromAssets('frame/the_age_of_miracles.png'),
};

// --- HUD (факт на диске: assets/UI/) ---

export const hudIcons = {
  coin: fromAssets('UI/monete_v1.png'),
  obereg: fromAssets('UI/secret_amulet.png'),
  oberegAlt: fromAssets('UI/amulet_against_the_house_spirit.png'),
  energy: fromAssets('UI/icon_energy.png'),
  smetana: fromAssets('UI/icon_smetana.png'),
  /** P1: assets/UI/icon_grass.png — пока fallback на пучок двора */
  grass: fromAssets('furniture/yard_grass.png'),
  candle: fromAssets('UI/icon_candle.png'),
  yagaShop: fromAssets('UI/icon_yaga_shop.png'),
  truthCrumb: fromAssets('UI/monete_v1.png'),
} as const;

// --- Духи: гравюра (книга, викторина, fallback трофеев) ---

export const spiritPortraitPaths = {
  brownie: fromAssets('creatures_in_the_book/brownie.png'),
  susedko: fromAssets('creatures_in_the_book/susedko.png'),
  bannik: fromAssets('creatures_in_the_book/bannik.png'),
  kikimora: fromAssets('creatures_in_the_book/kikimora.png'),
  poludnik: fromAssets('creatures_in_the_book/poludnik.png'),
  ovinnik: fromAssets('creatures_in_the_book/ovinnik.png'),
  leshiy: fromAssets('creatures_in_the_book/leshiy.png'),
  vodyanoy: fromAssets('creatures_in_the_book/vodyanoy.png'),
  dedushka_toptygin: fromAssets('creatures_in_the_book/dedushka_toptygin.png'),
  poludnica: fromAssets('creatures_in_the_book/poludnica.png'),
  rusalka: fromAssets('creatures_in_the_book/rusalka.png'),
  lada: fromAssets('creatures_in_the_book/lada.png'),
  veles: fromAssets('creatures_in_the_book/veles.png'),
  baba_yaga: fromAssets('creatures_in_the_book/baba_yaga.png'),
  koschei_immortal: fromAssets('creatures_in_the_book/koschei_immortal.png'),
  chudo_yudo: fromAssets('creatures_in_the_book/chudo_yudo.png'),
  yarilo: fromAssets('creatures_in_the_book/yarilo.png'),
  perun: fromAssets('creatures_in_the_book/perun.png'),
} as const;

export type SpiritId = keyof typeof spiritPortraitPaths;

// --- Бестиарий: цветные иллюстрации ---

export const spiritIllustrationPaths: Partial<Record<SpiritId, string>> = {
  brownie: fromAssets('illustration_book/brownie.png'),
  baba_yaga: fromAssets('illustration_book/Baba_Yaga.png'),
  bannik: fromAssets('illustration_book/bannik.png'),
  chudo_yudo: fromAssets('illustration_book/chudo_yodo.png'),
  yarilo: fromAssets('illustration_book/yarilo.png'),
  perun: fromAssets('illustration_book/perun.png'),
  dedushka_toptygin: fromAssets('illustration_book/Grandpa_Toptygin.png'),
  kikimora: fromAssets('illustration_book/kikimora.png'),
  koschei_immortal: fromAssets('illustration_book/koschei.png'),
  lada: fromAssets('illustration_book/lada.png'),
  leshiy: fromAssets('illustration_book/leschii.png'),
  ovinnik: fromAssets('illustration_book/ovinnik.png'),
  poludnica: fromAssets('illustration_book/poludnica.png'),
  poludnik: fromAssets('illustration_book/poludnik.png'),
  rusalka: fromAssets('illustration_book/rusalka.png'),
  susedko: fromAssets('illustration_book/susedko.png'),
  veles: fromAssets('illustration_book/veles.png'),
  vodyanoy: fromAssets('illustration_book/waterman.png'),
};

// --- Кот: скины (sit / sleep) ---

export type CatPose = 'sid' | 'sleep';

export interface CatSkinAssets {
  id: string;
  grade: Grade;
  folder: string;
  sit: string;
  sleep: string;
}

function catSkin(
  grade: Grade,
  folder: string,
  id: string,
  sitFile: string,
  sleepFile: string,
): CatSkinAssets {
  const base = `pets/${GRADE_FOLDER[grade]}/${folder}`;
  return {
    id,
    grade,
    folder,
    sit: fromAssets(`${base}/${sitFile}`),
    sleep: fromAssets(`${base}/${sleepFile}`),
  };
}

/** Все скины кота. Добавлять строку при новом файле в assets/pets/. */
export const catSkins: CatSkinAssets[] = [
  catSkin('common', 'cat_standart', 'cat_standart', 'cat_standart_sid.png', 'cat_standart_sleep.png'),
  catSkin('common', 'cat_grey', 'cat_grey', 'cat_grey_sid.png', 'cat_grey_sie.png'),
  catSkin('common', 'maycoon', 'maycoon', 'maycoon_sid.png', 'maycoon_sleep.png'),
  catSkin('common', 'snowsho', 'snowshoe', 'snowshoe_sid.png', 'snowshoe_sleep.png'),
  catSkin('common', 'white', 'white', 'white_sid.png', 'white_sleep.png'),
  catSkin('rare', 'black_green_spark', 'black_green_spark', 'black_green_spark_sid.png', 'sleep.png'),
  catSkin('rare', 'cyberpank', 'cyberpank', 'cyberpank_sid.png', 'cyberpank_sleep.png'),
  catSkin('rare', 'green_mage', 'green_mage', 'green_mage_sid.png', 'green_mage_sleep.png'),
  catSkin('rare', 'mace', 'mace', 'mace_sid.png', 'mace_sleep.png'),
  catSkin('rare', 'ninja', 'ninja', 'ninja_sid.png', 'ninja_sleep.png'),
  catSkin('rare', 'cat_pilgrim', 'cat_pilgrim', 'cat_pilgrim_sid.png', 'cat_pilgrim_sleep.png'),
  catSkin('epic', 'blue_mage', 'blue_mage', 'blue_mage_sid.png', 'blue_mage_sleep.png'),
  catSkin('epic', 'epic_hero', 'epic_hero', 'epic_hero_sid.png', 'epic_hero_sleep.png'),
  catSkin('epic', 'red_gunner', 'red_gunner', 'red_gunner_sid.png', 'red_gunner_sleep.png'),
  catSkin('epic', 'vulkan', 'vulkan', 'vulkan_sid.png', 'vulkan_sleep.png'),
  catSkin(
    'epoch',
    'flying_carpet',
    'flying_carpet',
    'flying_carpet_sid.png',
    'flying_carpet_sleep.png',
  ),
  catSkin('epoch', 'purple_mage', 'purple_mage', 'purple_mage_sid.png', 'purple_mage_sleep.png'),
  catSkin('epoch', 'smook', 'smook', 'smook_sid.png', 'smook_sleep.png'),
  catSkin(
    'epoch',
    'midnight_sun',
    'midnight_sun',
    'midnight_sun_sid.png',
    'midnight_sun_sleep.png',
  ),
  catSkin(
    'epoch',
    'fluffy_veles',
    'fluffy_veles',
    'fluffy_veles_sid.png',
    'fluffy_veles_sleep.png',
  ),
  catSkin(
    'epoch',
    'stormy_perun',
    'stormy_perun',
    'stormy_perun_sid.png',
    'stormy_perun_sleep.png',
  ),
  catSkin(
    'epoch',
    'wondrous_div',
    'wondrous_div',
    'wondrous_div_sid.png',
    'wondrous_div_sleep.png',
  ),
  catSkin(
    'epoch',
    'svarozhich',
    'svarozhich',
    'svarozhich_sid.png',
    'svarozhich_sleep.png',
  ),
];

export const DEFAULT_CAT_SKIN_ID = 'cat_standart';

export function getCatSkinById(id: string): CatSkinAssets | undefined {
  return catSkins.find((s) => s.id === id);
}

export function getCatPoseUrl(skinId: string, pose: CatPose): string {
  const skin = getCatSkinById(skinId) ?? getCatSkinById(DEFAULT_CAT_SKIN_ID)!;
  return pose === 'sleep' ? skin.sleep : skin.sit;
}

/** Компаньоны лавки Яги (не скины кота). `assets/pets/companion/`. */
export type CompanionPetId = 'pet_griffin' | 'pet_humpback_horse' | 'pet_firebird';

const companionPet = (folder: string, sitFile: string) => ({
  sit: fromAssets(`pets/companion/${folder}/${sitFile}`),
  sleep: fromAssets(`pets/companion/${folder}/${sitFile}`),
});

export const companionPetSprites: Partial<
  Record<CompanionPetId, { sit: string; sleep: string }>
> = {
  pet_griffin: companionPet('pet_griffin', 'pet_griffin_sid.png'),
  pet_humpback_horse: companionPet('pet_humpback_horse', 'pet_humpback_horse_sid.png'),
  pet_firebird: companionPet('pet_firebird', 'pet_firebird_sid.png'),
};

export function getCompanionPetPoseUrl(
  petId: string,
  pose: CatPose,
): string | undefined {
  const entry = companionPetSprites[petId as CompanionPetId];
  if (!entry) return undefined;
  return pose === 'sleep' ? entry.sleep : entry.sit;
}

// --- Трофеи 3D (fallback на гравюру, если файл отсутствует) ---

export const trophyAssetPaths: Partial<Record<SpiritId, string>> = {
  susedko: fromAssets('trophies/susedko_chest.png'),
  bannik: fromAssets('trophies/bannik_broom.png'),
  kikimora: fromAssets('trophies/kikimora_yarn.png'),
  poludnik: fromAssets('trophies/polevoy_wreath.png'),
  ovinnik: fromAssets('trophies/ovinnik_sheaf.png'),
  leshiy: fromAssets('trophies/leshiy_staff.png'),
  vodyanoy: fromAssets('trophies/vodyanoy_shell.png'),
  dedushka_toptygin: fromAssets('trophies/toptygin_paw.png'),
  poludnica: fromAssets('trophies/poludnica_sickle.png'),
  rusalka: fromAssets('trophies/rusalka_comb.png'),
  lada: fromAssets('trophies/lada_harmony_vase.png'),
  veles: fromAssets('trophies/veles_bust.png'),
  baba_yaga: fromAssets('trophies/yaga_hut.png'),
  koschei_immortal: fromAssets('trophies/koschei_needle.png'),
  chudo_yudo: fromAssets('trophies/chudo_figurine.png'),
  yarilo: fromAssets('trophies/yarilo_spring_shield.png'),
  perun: fromAssets('trophies/perun_oak_shield.png'),
};

export function getTrophyUrl(spiritId: SpiritId): string {
  return trophyAssetPaths[spiritId] ?? spiritPortraitPaths[spiritId];
}

// --- UI бестиария (Epic 10) ---

export const bookUi = {
  arrowLeft: fromAssets('UI/arrow_left_wood.png'),
  arrowRight: fromAssets('UI/arrow_right_wood.png'),
  questBtn: fromAssets('UI/book_quest_btn_wood.png'),
  closeBtn: fromAssets('UI/book_close_wood.png'),
  pawIcon: fromAssets('UI/icon_paw.png'),
  chapterProgress: fromAssets('UI/book_chapter_progress.png'),
  bookmark: fromAssets('UI/book_bookmark_green.png'),
} as const;
