import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

/** Канон формулировок — draft §1, не менять без правки таблицы правды. */
export const divinationQuestionPrompts: LocalizedText[] = [
  L('Ты добрый?', 'Are you kind?', 'İyisin mi?'),
  L('Ты живёшь в избе?', 'Do you live in the hut?', 'İzbada mı yaşıyorsun?'),
  L('Ты умеешь управлять стихией?', 'Can you command the elements?', 'Doğaya hükmeder misin?'),
  L('Ты из воды?', 'Are you from the water?', 'Sudan mısın?'),
  L('Ты из леса?', 'Are you from the forest?', 'Ormandan mısın?'),
  L('Ты похож на зверя?', 'Do you look like a beast?', 'Hayvana mı benziyorsun?'),
  L('Ты из поля?', 'Are you from the field?', 'Tarladan mısın?'),
  L('Ты любишь хитрить?', 'Do you love to trick?', 'Hile sever misin?'),
];
