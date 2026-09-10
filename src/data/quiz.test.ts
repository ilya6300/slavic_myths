import { describe, expect, it } from 'vitest';
import { spiritQuizzes, shuffleQuizQuestions } from './quiz';

describe('quiz data', () => {
  it('should contain 16 spirit quizzes from quests.md', () => {
    expect(spiritQuizzes).toHaveLength(16);
    const brownie = spiritQuizzes.find((q) => q.spiritId === 'brownie')!;
    expect(brownie.questions).toHaveLength(4);
    const totalQuestions = spiritQuizzes.reduce(
      (sum, q) => sum + q.questions.length,
      0,
    );
    expect(totalQuestions).toBeGreaterThanOrEqual(119);
    expect(totalQuestions).toBeLessThanOrEqual(120);
  });

  it('should shuffle answers and preserve correct index', () => {
    const brownie = spiritQuizzes.find((q) => q.spiritId === 'brownie')!;
    const shuffled = shuffleQuizQuestions(brownie.questions, () => 0.5);
    expect(shuffled[0].options).toHaveLength(3);
    const correct = shuffled[0].options[shuffled[0].correctIndex];
    const original = brownie.questions[0].options[brownie.questions[0].correctIndex];
    expect(correct).toBe(original);
  });
});
