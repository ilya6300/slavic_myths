import type { QuizPhase } from '../store/quizUiStore';

/** Классы точек прогресса викторины (quiz_layout.md §4 — done = пройденные). */
export function getQuizDotClassName(
  dotIndex: number,
  questionIndex: number,
  phase: QuizPhase,
): string {
  const classes = ['quiz-dot'];

  if (dotIndex < questionIndex) {
    classes.push('quiz-dot--done');
  } else if (dotIndex === questionIndex && phase !== 'question') {
    classes.push('quiz-dot--current');
  }

  return classes.join(' ');
}
