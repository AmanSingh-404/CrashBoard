const { GoogleGenerativeAI } = require('@google/generative-ai')
const { GEMINI_API_KEY }     = require('../config/env')

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const explainError = async (type, message, stack) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are an expert JavaScript/Node.js debugger.
A developer's app has crashed with the following error.
Analyze it and respond in this EXACT JSON format with no markdown, no backticks, just raw JSON:

{
  "cause": "One sentence explaining what caused this error",
  "explanation": "2-3 sentences explaining why this happens and what it means",
  "fix": "Exact code snippet or steps to fix it",
  "confidence": 92
}

Error Type: ${type}
Error Message: ${message}
Stack Trace:
${stack}
    `.trim()

    const result   = await model.generateContent(prompt)
    const response = await result.response
    const text     = response.text().trim()

    // strip any accidental markdown backticks
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return {
      cause:       parsed.cause       || '',
      explanation: parsed.explanation || '',
      fix:         parsed.fix         || '',
      confidence:  parsed.confidence  || 0,
      generatedAt: new Date(),
    }
  } catch (err) {
    console.error('[Gemini] Error:', err.message)
    // return a fallback so the app doesn't crash
    return {
      cause:       'Could not analyze this error automatically.',
      explanation: 'The AI service encountered an issue. Please review the stack trace manually.',
      fix:         'Check the stack trace above for the exact file and line number.',
      confidence:  0,
      generatedAt: new Date(),
    }
  }
}

module.exports = { explainError }