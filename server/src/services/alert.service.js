const nodemailer  = require('nodemailer')
const axios       = require('axios')
const Alert       = require('../models/Alert')
const ErrorModel  = require('../models/Error.models')
const { EMAIL_USER, EMAIL_PASS } = require('../config/env')

// ── create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,   // use Gmail App Password, not your real password
  },
})

// ── send email alert
const sendEmailAlert = async (to, error, project, occurrences) => {
  const subject = ` [CrashBoard] ${error.type} fired ${occurrences}× in ${project.name}`

  const html = `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
      <div style="background: #0b0c0e; padding: 20px; border-radius: 4px 4px 0 0;">
        <h1 style="color: #e8000d; margin: 0; font-size: 24px; letter-spacing: 0.04em;">
          CRASH/BOARD
        </h1>
        <p style="color: rgba(255,255,255,0.4); margin: 4px 0 0; font-size: 12px;">
          Smart Alert — threshold exceeded
        </p>
      </div>

      <div style="background: #f2efe8; padding: 24px; border: 1px solid #e0e0e0;">
        <div style="background: #fff; border: 1px solid #e0e0e0; border-left: 4px solid #e8000d; padding: 16px; margin-bottom: 16px; border-radius: 2px;">
          <div style="font-size: 11px; color: #e8000d; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
            CRITICAL ALERT — ${project.name}
          </div>
          <div style="font-size: 18px; font-weight: bold; color: #0b0c0e; margin-bottom: 4px;">
            ${error.type}
          </div>
          <div style="font-size: 13px; color: #3a3a3a; margin-bottom: 12px;">
            ${error.message}
          </div>
          <div style="display: flex; gap: 16px; font-size: 11px; color: #888;">
            <span> ${occurrences} occurrences</span>
            <span> ${error.affectedUsers} users affected</span>
            <span> ${error.browser || 'Unknown'}</span>
            <span> ${error.environment}</span>
          </div>
        </div>

        ${error.stack ? `
        <div style="background: #1a1a1a; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
          <div style="font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 8px; letter-spacing: 0.1em;">STACK TRACE</div>
          <pre style="color: #ff6666; font-size: 11px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${error.stack.slice(0, 500)}</pre>
        </div>
        ` : ''}

        <a href="http://localhost:5173/dashboard"
          style="display: inline-block; background: #e8000d; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 2px; letter-spacing: 0.06em;">
          → VIEW IN DASHBOARD
        </a>
      </div>

      <div style="background: #e0ddd6; padding: 12px 20px; font-size: 10px; color: #888; border-radius: 0 0 4px 4px;">
        CrashBoard Smart Alert · You're receiving this because you set up an alert for ${project.name}
      </div>
    </div>
  `

  await transporter.sendMail({
    from:    `"CrashBoard " <${EMAIL_USER}>`,
    to,
    subject,
    html,
  })

  console.log(` Alert email sent to ${to}`)
}

// ── send Slack alert
const sendSlackAlert = async (webhookUrl, error, project, occurrences) => {
  const payload = {
    text: ` *CrashBoard Alert — ${project.name}*`,
    attachments: [
      {
        color: '#e8000d',
        fields: [
          { title: 'Error Type',   value: error.type,    short: true },
          { title: 'Occurrences',  value: `${occurrences}×`, short: true },
          { title: 'Message',      value: error.message, short: false },
          { title: 'Environment',  value: error.environment, short: true },
          { title: 'Browser',      value: error.browser || 'Unknown', short: true },
        ],
        footer: 'CrashBoard Smart Alert',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  }

  await axios.post(webhookUrl, payload)
  console.log(` Slack alert sent to webhook`)
}

// ── main function — called after every error ingest
// checks all active alerts for this project and fires if threshold hit
const checkAndFireAlerts = async (project, error) => {
  try {
    // get all active alerts for this project
    const alerts = await Alert.find({
      project:  project._id,
      isActive: true,
    })

    if (alerts.length === 0) return

    for (const alert of alerts) {
      // check if alert type matches
      if (alert.errorType !== 'any' && alert.errorType !== error.type) continue

      // check cooldown — don't spam
      if (alert.lastFiredAt) {
        const minutesSinceLastFire = (Date.now() - new Date(alert.lastFiredAt)) / 60000
        if (minutesSinceLastFire < alert.cooldownMinutes) {
          console.log(` Alert ${alert._id} in cooldown (${Math.round(minutesSinceLastFire)}/${alert.cooldownMinutes} mins)`)
          continue
        }
      }

      // count how many times this error occurred in the time window
      const windowStart = new Date(Date.now() - alert.timeWindow * 60 * 1000)
      const recentCount = await ErrorModel.aggregate([
        {
          $match: {
            project:     project._id,
            fingerprint: error.fingerprint,
            lastSeenAt:  { $gte: windowStart },
          },
        },
        {
          $group: {
            _id:         null,
            totalOccurrences: { $sum: '$occurrences' },
          },
        },
      ])

      const occurrences = recentCount[0]?.totalOccurrences || error.occurrences

      // fire if threshold exceeded
      if (occurrences >= alert.threshold) {
        console.log(` Alert firing! ${error.type} hit ${occurrences}× (threshold: ${alert.threshold})`)

        // send email
        if (alert.emailEnabled && alert.emailTo) {
          await sendEmailAlert(alert.emailTo, error, project, occurrences)
        }

        // send Slack
        if (alert.slackEnabled && alert.slackWebhook) {
          await sendSlackAlert(alert.slackWebhook, error, project, occurrences)
        }

        // update lastFiredAt to start cooldown
        alert.lastFiredAt = new Date()
        await alert.save()
      }
    }
  } catch (err) {
    // never let alert failure crash the ingest
    console.error('[Alert Service] Error:', err.message)
  }
}

// ── send team invite email
const sendInviteEmail = async (toEmail, inviterName, projectName, inviteToken) => {
  const inviteUrl = `${process.env.CLIENT_URL}/invite/${inviteToken}`

  const html = `
    <div style="font-family: monospace; max-width: 600px; margin: 0 auto;">
      <div style="background: #0b0c0e; padding: 20px; border-radius: 4px 4px 0 0;">
        <h1 style="color: #e8000d; margin: 0; font-size: 24px; letter-spacing: 0.04em;">
          CRASH/BOARD
        </h1>
        <p style="color: rgba(255,255,255,0.4); margin: 4px 0 0; font-size: 12px;">
          Team Invitation
        </p>
      </div>
      <div style="background: #f2efe8; padding: 24px; border: 1px solid #e0e0e0;">
        <p style="font-size: 15px; color: #0b0c0e; margin: 0 0 16px;">
          <strong>${inviterName}</strong> has invited you to join
          <strong>${projectName}</strong> on CrashBoard.
        </p>
        <p style="font-size: 13px; color: #3a3a3a; margin: 0 0 24px;">
          CrashBoard is a real-time error monitoring platform. Once you join,
          you'll be able to view errors, add comments, and help resolve issues
          for this project.
        </p>
        <a href="${inviteUrl}"
          style="display: inline-block; background: #e8000d; color: #fff;
          padding: 12px 24px; text-decoration: none; font-size: 13px;
          font-weight: bold; border-radius: 2px; letter-spacing: 0.06em;">
          → ACCEPT INVITATION
        </a>
        <p style="font-size: 11px; color: #888; margin: 16px 0 0;">
          This invite link expires in 24 hours.
          If you didn't expect this email, you can ignore it.
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from:    `"CrashBoard " <${EMAIL_USER}>`,
    to:      toEmail,
    subject: `You've been invited to ${projectName} on CrashBoard`,
    html,
  })

  console.log(`Invite email sent to ${toEmail}`)
}

module.exports = { checkAndFireAlerts, sendEmailAlert, sendSlackAlert, sendInviteEmail }