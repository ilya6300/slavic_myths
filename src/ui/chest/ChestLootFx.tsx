import type { Grade } from '../../domain/grade';

interface ChestLootFxProps {
  grade: Grade;
  isMiracle: boolean;
  wasDuplicate?: boolean;
}

function particleCount(grade: Grade, isMiracle: boolean): number {
  if (isMiracle || grade === 'epoch') return 14;
  if (grade === 'epic') return 12;
  return 10;
}

function fxModifier(grade: Grade, isMiracle: boolean, wasDuplicate: boolean): string {
  const parts = ['chest-loot-fx'];
  if (isMiracle || grade === 'epoch') {
    parts.push('chest-loot-fx--salute');
  } else if (grade === 'epic') {
    parts.push('chest-loot-fx--epic');
  } else if (grade === 'rare') {
    parts.push('chest-loot-fx--rare');
  } else {
    parts.push('chest-loot-fx--confetti');
  }
  if (wasDuplicate) parts.push('chest-loot-fx--muted');
  return parts.join(' ');
}

export function ChestLootFx({ grade, isMiracle, wasDuplicate = false }: ChestLootFxProps) {
  const count = particleCount(grade, isMiracle);

  return (
    <div className={fxModifier(grade, isMiracle, wasDuplicate)} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="chest-loot-fx__particle" />
      ))}
    </div>
  );
}
