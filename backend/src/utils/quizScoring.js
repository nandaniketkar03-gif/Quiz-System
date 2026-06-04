const evaluateAnswers = ({ answers, questionMap }) => {
  const evaluatedAnswers = answers.map((answer) => {
    const question = questionMap.get(String(answer.questionId));

    if (!question) {
      throw new Error('Invalid question in answers payload');
    }

    const isCorrect = question.correctAnswer === answer.selectedAnswer;

    return {
      question: question.id,
      selectedAnswer: answer.selectedAnswer,
      isCorrect
    };
  });

  const score = evaluatedAnswers.filter((entry) => entry.isCorrect).length;
  const totalQuestions = evaluatedAnswers.length;
  const percentage = Number(((score / totalQuestions) * 100).toFixed(2));

  return { evaluatedAnswers, score, totalQuestions, percentage };
};

module.exports = { evaluateAnswers };
