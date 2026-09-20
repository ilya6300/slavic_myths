import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const dailyQuestContent = {
  panelTitle: L('Задания дня', 'Daily tasks', 'Günlük görevler'),
  taskClicks: L('Погладить кота', 'Pet the cat', 'Kediyi sev'),
  taskTale: L('Сказ дня', 'Tale of the day', 'Günün masalı'),
  clicksProgress: L(
    '{done} / {total} кликов',
    '{done} / {total} clicks',
    '{done} / {total} tıklama',
  ),
  taleDone: L('Сказ пройден', 'Tale complete', 'Masal tamam'),
  taleOpen: L('Читать и ответить', 'Read and answer', 'Oku ve cevapla'),
  claimFragment: L('Забрать осколок', 'Claim fragment', 'Parçayı al'),
  claimDone: L('Награда получена', 'Reward claimed', 'Ödül alındı'),
  taleModalTitle: L('Сказ дня', 'Tale of the day', 'Günün masalı'),
  taleIntro: L(
    'Сегодня кот вспомнил сказ о {spirit}.',
    'Today the cat remembered a tale of {spirit}.',
    'Bugün kedi {spirit} masalını hatırladı.',
  ),
};
