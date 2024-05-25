const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  question: Number,
  opt: String,
  weight: Number,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
