const express = require('express');
const auth = require('../middleware/auth');
const {
  listQuizzes,
  getQuizQuestions,
  submitQuiz,
  history,
  performance
} = require('../controllers/quizController');

const router = express.Router();

router.use(auth);
router.get('/', listQuizzes);
router.get('/:quizId/questions', getQuizQuestions);
router.post('/:quizId/submit', submitQuiz);
router.get('/me/history', history);
router.get('/me/performance', performance);

module.exports = router;
