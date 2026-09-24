/**
 * Реплики питомцев при клике (лавка Яги, draft §6).
 * Канон текстов: согласовано с владельцем; голос — сам питомец.
 */

import type { LocalizedLines } from '../i18n/types';
import type { PetId } from './pets';

const L = (
  ru: string,
  en: string,
  tr: string,
): { ru: string; en: string; tr: string } => ({ ru, en, tr });

export const petClickDialogContent: Record<PetId, LocalizedLines> = {
  pet_griffin: [
    L(
      'Мурлыкать я не умею. Умею смотреть так, что половица сама замолкает.',
      'I can\'t purr. I can stare until the floorboard shuts up on its own.',
      'Mırlayamam. Tahtanın kendi kendine susmasına bakabilirim.',
    ),
    L(
      'Крупица упала? Положи на лавку. С пола я не подбираю.',
      'Dropped a crumb? Put it on the bench. I don\'t pick up from the floor.',
      'Kırıntı düştü mü? Banka koy. Yerden almam.',
    ),
    L(
      'Погладить, хочешь? Не бойся, не укушу.',
      'Want a pet? Don\'t worry — I won\'t bite.',
      'Okşamak ister misin? Korkma, ısırmam.',
    ),
    L(
      'Суседко мимо пробежал? Я видел. Я страж, а не охотник.',
      'Susedko ran past? I saw him. I\'m a guard, not a hunter.',
      'Susedko koşup geçti mi? Gördüm. Ben bekçiyim, avcı değil.',
    ),
    L(
      'Хвост кота махнул — ветерок. Я махнул бы — был бы ураган. Хорошо, что я сдержанный.',
      'The cat\'s tail flicked — a breeze. If I flicked, it\'d be a storm. Good thing I\'m restrained.',
      'Kedinin kuyruğu sallandı — esinti. Ben sallasam kasırga olurdu. İyi ki özdenetimliyim.',
    ),
    L(
      'Хочешь полетать? И я хочу. Как жаль, что у тебя нет крыльев.',
      'Want to fly? Me too. Too bad you don\'t have wings.',
      'Uçmak ister misin? Ben de. Keşke senin de kanatların olsaydı.',
    ),
  ],
  pet_humpback_horse: [
    L(
      'Топ-топ-топ… Ой, половица вздрогнула. Значит, ритм попал.',
      'Trot-trot-trot… Oops, the board jumped. Means the rhythm\'s right.',
      'Tık-tık-tık… Ay, tahta zıpladı. Demek ritim tuttu.',
    ),
    L(
      'Я у Яги не научился магии — научился не мешать другим.',
      'At Yaga\'s I didn\'t learn magic — I learned not to get in the way.',
      'Yaga\'da büyü öğrenmedim — başkalarına engel olmamayı öğrendim.',
    ),
    L(
      'Ночью я не боюсь темноты. Боюсь, когда хозяин забывает меня покормить…',
      'At night I\'m not scared of the dark. I\'m scared when the owner forgets to feed me…',
      'Geceleri karanlıktan korkmam. Sahibim beni beslemeyi unuttuğunda korkarım…',
    ),
    L(
      'Если устанешь кликать — сядь. Поменяй руку.',
      'Tired of clicking? Sit down. Switch hands.',
      'Tıklamaktan yoruldun mu? Otur. Eli değiştir.',
    ),
    L(
      'Хочешь прокатиться? Скажи «куда».',
      'Want a ride? Say "where to".',
      'Gezmek ister misin? "Nereye" de.',
    ),
    L(
      'Сколько можно, лучше бы сено дал.',
      'How much more — you could\'ve given me hay by now.',
      'Ne kadar daha — saman versen ya.',
    ),
  ],
  pet_firebird: [
    L(
      'Осторожно с усами кота: они искрятся.',
      'Careful with the cat\'s whiskers — they spark.',
      'Kedinin bıyıklarına dikkat — kıvılcım çıkarıyorlar.',
    ),
    L(
      'Одно перо упало… на пол. Подними — пока всё не полыхнуло.',
      'A feather fell… on the floor. Pick it up — before everything flares up.',
      'Bir tüy düştü… yere. Al — her şey alev almadan.',
    ),
    L(
      'Книгу откроешь — я подсвечу страницу.',
      'Open the book — I\'ll light the page.',
      'Kitabı aç — sayfayı aydınlatırım.',
    ),
    L(
      'Зачем тебе печка, если есть я?',
      'Why do you need the stove when you\'ve got me?',
      'Ben varken sobaya ne gerek var?',
    ),
    L(
      'Так, а огнетушитель-то в избе есть?',
      'Wait — is there even a fire extinguisher in the hut?',
      'Dur — kulübede yangın söndürücü var mı ki?',
    ),
  ],
};
