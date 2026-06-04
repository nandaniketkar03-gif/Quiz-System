const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { evaluateAnswers } = require('../utils/quizScoring');

const listQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ isActive: true }).populate('category', 'name');
  return res.json(quizzes);
};

const getQuizQuestions = async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz || !quiz.isActive) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  const filters = { category: quiz.category };
  if (quiz.questions.length) {
    filters._id = { $in: quiz.questions };
  }

  const questions = await Question.aggregate([
    { $match: filters },
    { $sample: { size: quiz.questionCount } },
    { $project: { text: 1, options: 1, difficulty: 1 } }
  ]);

  return res.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      durationMinutes: quiz.durationMinutes
    },
    questions
  });
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const { quizId } = req.params;

  if (!Array.isArray(answers) || !answers.length) {
    return res.status(400).json({ message: 'Answers are required' });
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } });

  if (questions.length !== questionIds.length) {
    return res.status(400).json({ message: 'One or more question IDs are invalid' });
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  let scoringResult;

  try {
    scoringResult = evaluateAnswers({ answers, questionMap });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const attempt = await Attempt.create({
    user: req.user.id,
    quiz: quizId,
    answers: scoringResult.evaluatedAnswers,
    score: scoringResult.score,
    totalQuestions: scoringResult.totalQuestions,
    percentage: scoringResult.percentage
  });

  return res.status(201).json({
    attemptId: attempt.id,
    score: scoringResult.score,
    totalQuestions: scoringResult.totalQuestions,
    percentage: scoringResult.percentage
  });
};

const history = async (req, res) => {
  const attempts = await Attempt.find({ user: req.user.id })
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });

  return res.json(attempts);
};

const performance = async (req, res) => {
  const stats = await Attempt.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$user',
        attempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        bestScore: { $max: '$percentage' }
      }
    }
  ]);

  if (!stats.length) {
    return res.json({ attempts: 0, averageScore: 0, bestScore: 0 });
  }

  return res.json({
    attempts: stats[0].attempts,
    averageScore: Number(stats[0].averageScore.toFixed(2)),
    bestScore: Number(stats[0].bestScore.toFixed(2))
  });
};

module.exports = { listQuizzes, getQuizQuestions, submitQuiz, history, performance };
