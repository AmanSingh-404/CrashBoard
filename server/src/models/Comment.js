const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    error:   { type: mongoose.Schema.Types.ObjectId, ref: 'Error',   required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    text:    { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)