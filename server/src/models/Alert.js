const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    // what triggers this alert
    threshold:    { type: Number, default: 5 },    // how many occurrences
    timeWindow:   { type: Number, default: 10 },   // in minutes
    errorType:    { type: String, default: 'any' }, // 'any' or specific type like 'TypeError'

    // where to send the alert
    emailEnabled: { type: Boolean, default: true },
    emailTo:      { type: String, default: '' },
    slackEnabled: { type: Boolean, default: false },
    slackWebhook: { type: String, default: '' },

    // cooldown — prevents spam
    // if alert fired recently, don't fire again for X minutes
    cooldownMinutes: { type: Number, default: 30 },
    lastFiredAt:     { type: Date, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Alert', alertSchema)