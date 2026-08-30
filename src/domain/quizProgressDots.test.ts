import { describe, expect, it } from 'vitest';
import { getQuizDotClassName } from './quizProgressDots';

describe('getQuizDotClassName', () => {
  it('should mark current question neutral while answering question 3 of 3', () => {
    expect(getQuizDotClassName(0, 2, 'question')).toBe('quiz-dot quiz-dot--done');
    expect(getQuizDotClassName(1, 2, 'question')).toBe('quiz-dot quiz-dot--done');
    expect(getQuizDotClassName(2, 2, 'question')).toBe('quiz-dot');
  });

  it('should mark passed questions done on question 1 of 3', () => {
    expect(getQuizDotClassName(0, 0, 'question')).toBe('quiz-dot');
    expect(getQuizDotClassName(1, 0, 'question')).toBe('quiz-dot');
  });

  it('should highlight current dot after answer flash', () => {
    expect(getQuizDotClassName(0, 0, 'correct')).toBe(
      'quiz-dot quiz-dot--current',
    );
    expect(getQuizDotClassName(0, 0, 'wrong')).toBe('quiz-dot quiz-dot--current');
  });
});
