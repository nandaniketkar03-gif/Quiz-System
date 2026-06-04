const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { matchedData } = require('express-validator');
const pick = (obj, fields) =>
  fields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      acc[field] = obj[field];
    }
    return acc;
  }, {});

const crud = (Model, allowedFields) => ({
  list: async (req, res) => {
    const items = await Model.find().sort({ createdAt: -1 });
    return res.json(items);
  },
  create: async (req, res) => {
    const payload = pick(req.body, allowedFields);
    const item = await Model.create(payload);
    return res.status(201).json(item);
  },
  update: async (req, res) => {
    const payload = pick(req.body, allowedFields);
    const item = await Model.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.json(item);
  },
  remove: async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.status(204).send();
  }
});

const categoryController = crud(Category, ['name', 'description']);
const questionController = crud(Question, ['text', 'options', 'correctAnswer', 'category', 'difficulty']);
const quizController = crud(Quiz, [
  'title',
  'description',
  'category',
  'questions',
  'questionCount',
  'durationMinutes',
  'isActive'
]);

const listUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return res.json(users);
};

const updateUserRole = async (req, res) => {
  const { role } = matchedData(req, { locations: ['body'] });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
};

module.exports = {
  categoryController,
  questionController,
  quizController,
  listUsers,
  updateUserRole
};
