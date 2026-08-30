/** Грейд коллекционных предметов. В UI финала — «Эпоха чудес», не legendary. */
export type Grade = 'common' | 'rare' | 'epic' | 'epoch';

/** Имя папки на диске для грейда (pets, brownie, frame). */
export const GRADE_FOLDER: Record<Grade, string> = {
  common: 'common',
  rare: 'rate',
  epic: 'epic',
  epoch: 'the_age_of_miracles',
};
