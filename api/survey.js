const { Resend } = require('resend');
const { verifyRecaptcha } = require('./_recaptcha');

const resend = new Resend(process.env.RESEND_API_KEY);

const TEAM_EMAIL = 'info@xleratorai.com';
const FROM_EMAIL = 'XLeratorAI <noreply@xleratorai.com>';

// ── Brand colors ──
const NAVY = '#0f1f38';
const NAVY_DARK = '#0a1628';
const BLUE = '#1f7bff';
const CYAN = '#0099cc';
const PURPLE = '#5b21b6';
const MUTED = '#5a6e8a';
const BORDER = '#e4eaf3';
const BG = '#f0f4f9';
const GREEN = '#0d7a4e';
const AMBER = '#b45309';
const RED = '#b91c1c';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ratingLabel(score) {
  const s = parseFloat(score);
  if (s >= 7) return { label: 'Good', color: GREEN, bg: '#e6f5ed' };
  if (s >= 4) return { label: 'Needs Improvement', color: AMBER, bg: '#fef3e2' };
  return { label: 'Critical Gap', color: RED, bg: '#fde8e8' };
}

function scoreBar(score, color) {
  const pct = Math.round((parseFloat(score) / 10) * 100);
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="width:${pct}%;height:8px;background:${color};border-radius:4px 0 0 4px;"></td>
    <td style="width:${100 - pct}%;height:8px;background:${BORDER};border-radius:0 4px 4px 0;"></td>
  </tr></table>`;
}

// ── Report email to the user ──
function buildReportEmail(data) {
  const { email, company, industry, nistScore, euScore, recommendations } = data;
  const firstName = escapeHtml((data.name || '').split(' ')[0] || 'there');
  const nistR = ratingLabel(nistScore);
  const euR = ratingLabel(euScore);
  const overall = ((parseFloat(nistScore) + parseFloat(euScore)) / 2).toFixed(1);
  const overallR = ratingLabel(overall);

  const recHtml = (recommendations || []).map(r => `
    <tr><td style="padding:16px 20px;border-bottom:1px solid ${BORDER};">
      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${NAVY};">${escapeHtml(r.title)}</p>
      <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.5;">${escapeHtml(r.text)}</p>
    </td></tr>`).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your AI Compliance Gap Report</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:${NAVY_DARK};padding:32px 40px;border-radius:14px 14px 0 0;text-align:center;">
    <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">XLerator<span style="color:${BLUE}">AI</span></span>
    <p style="margin:8px 0 0;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);">AI Compliance Gap Report</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:40px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};">

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${NAVY};">Hi ${firstName}, here are your results.</h1>
    <p style="margin:0 0 28px;font-size:14px;color:${MUTED};line-height:1.6;">Your organization${company ? ` (${escapeHtml(company)})` : ''} was assessed against NIST AI RMF 1.0 and the EU AI Act${industry ? ` as a <strong style="color:${NAVY};">${escapeHtml(industry)}</strong> organization` : ''}.</p>

    <!-- Overall Score -->
    <div style="background:${BLUE};border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.6);">Overall Governance Score</p>
      <p style="margin:0 0 8px;font-size:48px;font-weight:800;color:#ffffff;line-height:1;">${escapeHtml(overall)}<span style="font-size:20px;color:rgba(255,255,255,0.5);"> / 10</span></p>
      <span style="display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;padding:4px 14px;border-radius:999px;">${escapeHtml(overallR.label)}</span>
    </div>

    <!-- Score Cards -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="48%" style="padding:20px;background:rgba(0,153,204,0.06);border:1px solid rgba(0,153,204,0.2);border-radius:10px;text-align:center;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${CYAN};">NIST AI RMF</p>
          <p style="margin:0 0 8px;font-size:36px;font-weight:800;color:${CYAN};line-height:1;">${escapeHtml(String(nistScore))}<span style="font-size:14px;color:${MUTED};"> / 10</span></p>
          ${scoreBar(nistScore, CYAN)}
          <p style="margin:8px 0 0;font-size:11px;font-weight:600;color:${nistR.color};">${escapeHtml(nistR.label)}</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="padding:20px;background:rgba(91,33,182,0.05);border:1px solid rgba(91,33,182,0.15);border-radius:10px;text-align:center;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${PURPLE};">EU AI Act</p>
          <p style="margin:0 0 8px;font-size:36px;font-weight:800;color:${PURPLE};line-height:1;">${escapeHtml(String(euScore))}<span style="font-size:14px;color:${MUTED};"> / 10</span></p>
          ${scoreBar(euScore, PURPLE)}
          <p style="margin:8px 0 0;font-size:11px;font-weight:600;color:${euR.color};">${escapeHtml(euR.label)}</p>
        </td>
      </tr>
    </table>

    <!-- Recommendations -->
    ${recHtml ? `
    <div style="margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BLUE};">Key Recommendations</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
        ${recHtml}
      </table>
    </div>` : ''}

    <!-- CTA -->
    <div style="background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:28px;text-align:center;">
      <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:${NAVY};">Ready to close the gaps?</h2>
      <p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.5;">Our team can help you build a compliant, scalable AI governance framework — fast. Schedule a working session and we'll create a tailored 30-day remediation roadmap.</p>
      <a href="https://xleratorai.com/contact.html" style="display:inline-block;background:${BLUE};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;">Schedule a Working Session →</a>
    </div>

    <p style="margin:24px 0 0;font-size:13px;color:${MUTED};line-height:1.6;">Have questions about your results? Simply reply to this email and a senior team member will get back to you within one business day.</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:${NAVY_DARK};padding:28px 40px;border-radius:0 0 14px 14px;text-align:center;">
    <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.5);">XLeratorAI — AI-powered accelerators for complex business processes.</p>
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">&copy; ${new Date().getFullYear()} XLeratorAI. All rights reserved.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// ── Team notification email ──
function buildTeamNotification(data) {
  const { name, email, company, industry, nistScore, euScore } = data;
  const overall = ((parseFloat(nistScore) + parseFloat(euScore)) / 2).toFixed(1);
  const overallR = ratingLabel(overall);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>New Assessment Lead</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:${NAVY_DARK};padding:28px 40px;border-radius:14px 14px 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><span style="font-size:20px;font-weight:800;color:#ffffff;">XLerator<span style="color:${BLUE}">AI</span></span></td>
        <td align="right"><span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;background:${GREEN};padding:5px 12px;border-radius:999px;">Assessment Lead</span></td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="background:#ffffff;padding:36px 40px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};">
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BLUE};">Survey Report Requested</p>
    <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:${NAVY};">${escapeHtml(name || 'Unknown')} requested their gap report via email</h1>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};width:120px;">Name</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${NAVY};">${escapeHtml(name || '—')}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">Email</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${NAVY};"><a href="mailto:${escapeHtml(email)}" style="color:${BLUE};text-decoration:none;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">Company</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${NAVY};">${escapeHtml(company || '—')}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">Industry</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${NAVY};">${escapeHtml(industry || '—')}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">NIST Score</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;font-weight:700;color:${CYAN};">${escapeHtml(String(nistScore))} / 10</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">EU AI Act</td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:14px;font-weight:700;color:${PURPLE};">${escapeHtml(String(euScore))} / 10</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;font-weight:600;text-transform:uppercase;color:${MUTED};">Overall</td><td style="padding:8px 0;font-size:14px;font-weight:700;color:${overallR.color};">${overall} / 10 — ${escapeHtml(overallR.label)}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:${BLUE};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;">Reply to ${escapeHtml((name || '').split(' ')[0] || 'Lead')} →</a>
    </td></tr></table>
  </td></tr>

  <tr><td style="background:${BG};padding:20px 40px;border-top:1px solid ${BORDER};border-radius:0 0 14px 14px;text-align:center;">
    <p style="margin:0;font-size:12px;color:${MUTED};">This lead came from the AI Compliance Gap Analyzer on xleratorai.com</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// ── Serverless handler ──
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, company, industry, nistScore, euScore, recommendations, recaptchaToken } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Please enter your email address.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Verify reCAPTCHA
  const captcha = await verifyRecaptcha(recaptchaToken, 'survey_report');
  if (!captcha.success) {
    return res.status(403).json({ error: 'Security check failed. Please refresh the page and try again.' });
  }

  const data = { name, email, company, industry, nistScore, euScore, recommendations };

  try {
    await Promise.all([
      // Report email to the user
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        replyTo: TEAM_EMAIL,
        subject: `Your AI Compliance Gap Report — ${company || 'XLeratorAI'}`,
        html: buildReportEmail(data),
      }),
      // Lead notification to the team
      resend.emails.send({
        from: FROM_EMAIL,
        to: [TEAM_EMAIL],
        replyTo: email,
        subject: `Assessment Lead: ${name || 'Unknown'} — ${industry || 'General'} — Score ${((parseFloat(nistScore) + parseFloat(euScore)) / 2).toFixed(1)}/10`,
        html: buildTeamNotification(data),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Survey email error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again or download your report instead.' });
  }
};
