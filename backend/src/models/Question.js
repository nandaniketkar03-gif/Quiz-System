const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (opts) => Array.isArray(opts) && opts.length >= 2,
        message: 'At least two options are required'
      }
    },
    correctAnswer: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
