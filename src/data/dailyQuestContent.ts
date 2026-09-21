import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const dailyQuestContent = {
  panelTitle: L('Задания дня', 'Daily tasks', 'Günlük görevler'),
  taskClicks: L('Погладить кота', 'Pet the cat', 'Kediyi sev'),
  taskTale: L('Сказ дня', 'Tale of the day', 'Günün masalı'),
  taleSpiritHint: L(
    'Сказ о {spirit}',
    'Tale of {spirit}',
    '{spirit} masalı',
  ),
  clicksProgress: L(
    '{done} / {total} кликов',
    '{done} / {total} clicks',
    '{done} / {total} tıklama',
  ),
  taleDone: L('Сказ пройден', 'Tale complete', 'Masal tamam'),
  taleOpen: L(
    'Прочти и ответь на сказку!',
    'Read the tale and answer!',
    'Masalı oku ve cevapla!',
  ),
  taleQuizCta: L('Ответить', 'Answer', 'Cevapla'),
  claimFragment: L(
    'Забрать фрагмент — {spirit}',
    'Claim fragment — {spirit}',
    'Parçayı al — {spirit}',
  ),
  claimDone: L('Награда получена', 'Reward claimed', 'Ödül alındı'),
  taleModalTitle: L('Сказ дня', 'Tale of the day', 'Günün masalı'),
  taleIntro: L(
    'Сегодня кот вспомнил сказ о {spirit}.',
    'Today the cat remembered a tale of {spirit}.',
    'Bugün kedi {spirit} masalını hatırladı.',
  ),
};
