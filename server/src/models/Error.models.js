const mongoose = require('mongoose')

const errorSchema = new mongoose.Schema(
  {
    // which project this error belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true, // index for fast queries
    },

    // error details
    type: {
      type: String,
      required: true, // e.g. "TypeError", "ReferenceError"
    },
    message: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
      default: '',
    },

    // fingerprint = unique hash of message + stack
    // used for deduplication — same error groups together
    fingerprint: {
      type: String,
      required: true,
      index: true,
    },

    // how many times this exact error has occurred
    occurrences: {
      type: Number,
      default: 1,
    },

    // how many unique users hit this error
    affectedUsers: {
      type: Number,
      default: 1,
    },

    // environment info from the SDK
    environment: {
      type: String,
      enum: ['production', 'staging', 'development'],
      default: 'production',
    },

    // browser / device info
    userAgent: { type: String, default: '' },
    browser:   { type: String, default: '' },
    os:        { type: String, default: '' },
    url:       { type: String, default: '' },

    // last 10 user actions before the error (session replay)
    breadcrumbs: [
      {
        type:      { type: String }, // 'click', 'navigation', 'api_call'
        message:   { type: String },
        timestamp: { type: Date },
      },
    ],

    // Core Web Vitals if captured
    webVitals: {
      lcp:  { type: Number },
      fcp:  { type: Number },
      cls:  { type: Number },
      ttfb: { type: Number },
    },

    // workflow status
    status: {
      type: String,
      enum: ['open', 'resolved', 'ignored'],
      default: 'open',
      index: true,
    },

    // who this error is assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // AI explanation from Gemini (cached so we don't call API every time)
    aiExplanation: {
      cause:      { type: String, default: '' },
      fix:        { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      generatedAt:{ type: Date },
    },

    // when the error was first and last seen
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt:  { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Error', errorSchema)