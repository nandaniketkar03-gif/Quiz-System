const { evaluateAnswers } = require('../src/utils/quizScoring');

describe('evaluateAnswers', () => {
  test('returns correct score and percentage', () => {
    const questionMap = new Map([
      ['q1', { id: 'q1', correctAnswer: 'A' }],
      ['q2', { id: 'q2', correctAnswer: 'B' }]
    ]);

    const result = evaluateAnswers({
      answers: [
        { questionId: 'q1', selectedAnswer: 'A' },
        { questionId: 'q2', selectedAnswer: 'C' }
      ],
      questionMap
    });

    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(2);
    expect(result.percentage).toBe(50);
    expect(result.evaluatedAnswers[0].isCorrect).toBe(true);
    expect(result.evaluatedAnswers[1].isCorrect).toBe(false);
  });

  test('throws when question id is unknown', () => {
    const questionMap = new Map([['q1', { id: 'q1', correctAnswer: 'A' }]]);

    expect(() =>
      evaluateAnswers({
        answers: [{ questionId: 'missing', selectedAnswer: 'A' }],
        questionMap
      })
    ).toThrow('Invalid question in answers payload');
  });
});
