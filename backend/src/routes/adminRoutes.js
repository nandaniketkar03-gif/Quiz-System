const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validate');
const {
  categoryController,
  questionController,
  quizController,
  listUsers,
  updateUserRole
} = require('../controllers/adminController');

const router = express.Router();

router.use(auth, requireAdmin);

router.get('/categories', categoryController.list);
router.post('/categories', [body('name').trim().notEmpty()], validate, categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.remove);

router.get('/questions', questionController.list);
router.post(
  '/questions',
  [
    body('text').trim().notEmpty(),
    body('options').isArray({ min: 2 }),
    body('correctAnswer').notEmpty(),
    body('category').isMongoId()
  ],
  validate,
  questionController.create
);
router.put('/questions/:id', questionController.update);
router.delete('/questions/:id', questionController.remove);

router.get('/quizzes', quizController.list);
router.post(
  '/quizzes',
  [body('title').trim().notEmpty(), body('category').isMongoId(), body('questionCount').optional().isInt({ min: 1 })],
  validate,
  quizController.create
);
router.put('/quizzes/:id', quizController.update);
router.delete('/quizzes/:id', quizController.remove);

router.get('/users', listUsers);
router.patch('/users/:id/role', [body('role').isIn(['user', 'admin'])], validate, updateUserRole);

module.exports = router;
