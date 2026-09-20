/**
 * Тексты гадания: порог, стекло, truth-table (draft §1).
 */

import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const divinationThresholdLines: LocalizedText[] = [
  L(
    'Ты уверен, что хочешь поговорить с духами?',
    'Are you sure you want to speak with the spirits?',
    'Ruhlarla konuşmak istediğine emin misin?',
  ),
  L(
    'Стекло уже мутнеет. Спросишь, пока свеча держит?',
    'The glass is already clouding. Will you ask while the candle holds?',
    'Cam bulanıyor. Mum dayanırken soracak mısın?',
  ),
  L(
    'За рамой тепло и дым. Готов слушать чужой голос?',
    'Warmth and smoke behind the frame. Ready to hear another voice?',
    'Çerçevenin ardında duman ve sıcaklık. Başka bir sesi dinlemeye hazır mısın?',
  ),
  L(
    'Кто-то в стекле уже ждёт вопроса. Начнём?',
    'Someone in the glass already waits for a question. Shall we begin?',
    'Camda biri soruyu bekliyor. Başlayalım mı?',
  ),
  L(
    'Разговор будет короткий, а свеча — одна. Спросишь?',
    'The talk will be short, and the candle is one. Will you ask?',
    'Sohbet kısa, mum tek. Soracak mısın?',
  ),
];

export const divinationSpiritGreetings: LocalizedText[] = [
  L('Привет, кот!', 'Hi, cat!', 'Merhaba, kedi!'),
  L('Зачем ты меня звал?', 'Why did you call me?', 'Neden çağırdın?'),
  L('…', '…', '…'),
  L('Здравствуй.', 'Hello.', 'Merhaba.'),
];

export const divinationUi = {
  closedOverlay: L(
    'Гадание закрыто. Сначала договорись с Бабой-Ягой.',
    'Divination is closed. Deal with Baba Yaga first.',
    'Falcılık kapalı. Önce Baba Yaga ile anlaş.',
  ),
  ask: L('Спросить', 'Ask', 'Sor'),
  notNow: L('Не сейчас', 'Not now', 'Şimdi değil'),
  guessTitle: L('Я думаю это…', 'I think it is…', 'Sanırım bu…'),
  resultCorrect: L('Правильно!', 'Correct!', 'Doğru!'),
  resultWrong: L('Не верно!', 'Not quite!', 'Yanlış!'),
  continue: L('Дальше', 'Continue', 'Devam'),
  done: L('Готово', 'Done', 'Tamam'),
  mirrorLockedGlass: L(
    'Откроется после Бабы-Яги',
    'Opens after Baba Yaga',
    'Baba Yaga\'dan sonra açılır',
  ),
};

export const divinationMirrorPromptLines: LocalizedText[] = [
  L('Спрашивай, пока дым держит голос.', 'Ask while the smoke holds the voice.', 'Duman sesi tutarken sor.'),
  L('Стекло слышит. Не зови по имени — спрашивай.', 'The glass hears. Do not call a name — ask.', 'Cam duyar. İsimle çağırma — sor.'),
  L('Дым гуще. У тебя два вопроса.', 'The smoke is thicker. You have two questions.', 'Duman koyulaştı. İki sorun var.'),
  L('Голос за рамой. Спроси внятно.', 'A voice beyond the frame. Ask clearly.', 'Çerçevenin ötesinde ses. Net sor.'),
  L('Я здесь. Сначала вопрос, имя — потом.', 'I am here. Question first, name — after.', 'Buradayım. Önce soru, isim — sonra.'),
];
