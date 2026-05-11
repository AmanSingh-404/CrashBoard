const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // the user who created this project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // unique key the SDK sends with every error payload
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    // team members who have access
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
      },
    ],
    platform: {
      type: String,
      enum: ['javascript', 'react', 'nextjs', 'node', 'other'],
      default: 'javascript',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)