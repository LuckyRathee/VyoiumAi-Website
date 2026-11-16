import nodemailer from 'nodemailer';

export function smtpConfiguration(env) {
  const port = Number(env.SMTP_PORT || 587);
  const mailbox = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !mailbox.test(env.SMTP_FROM || '') || !mailbox.test(env.ENQUIRY_TO || '') || !Number.isInteger(port) || port < 1 || port > 65535) return null;
  return { host: env.SMTP_HOST, port, secure: env.SMTP_SECURE === 'true' || (env.SMTP_SECURE === undefined && port === 465), requireTLS: env.SMTP_REQUIRE_TLS !== 'false', auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true }, disableFileAccess: true, disableUrlAccess: true };
}

export function mailTransport(env, injected) {
  const config = smtpConfiguration(env);
  return config ? injected ?? nodemailer.createTransport(config) : null;
}

export const LIMITS = Object.freeze({ name: 120, email: 254, message: 5000, source: 500, website: 200 });

export function validateFields(input) {
  const fields = {};
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields, errors: { form: 'Provide an enquiry object.' } };
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string') {
      fields[key] = '';
      errors[key] = 'Use text only.';
      continue;
    }
    fields[key] = value.trim().slice(0, max);
    if (value.length > max) errors[key] = `Use no more than ${max} characters.`;
  }
  for (const key of ['name', 'email', 'message']) if (!fields[key]) errors[key] = 'This field is required.';
  if (fields.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (/[\r\n\x00-\x1f\x7f]/.test(fields.name || '')) errors.name = 'Use a single-line name.';
  return { fields, errors };
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function responseHtml({ ok, message, errors = {} }, fields = {}) {
  const e = escapeHtml;
  const input = (name, label, type = 'text') => `<label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" maxlength="${LIMITS[name]}" value="${e((fields[name] || '').slice(0, LIMITS[name]))}" required${errors[name] ? ` aria-invalid="true" aria-describedby="${name}-error"` : ''}>${errors[name] ? `<p id="${name}-error">${e(errors[name])}</p>` : ''}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enquiry | Vyoium AI</title><meta name="robots" content="noindex"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css"></head><body><header class="site-header"><a class="logo" href="/" aria-label="Vyoium AI home"><img src="/assets/logo.png" alt="" width="92" height="54"></a></header><main class="page-intro enquiry-result"><p class="eyebrow">Enquiry</p><h1>${ok ? 'Enquiry sent' : 'Send an enquiry'}</h1><p role="${ok ? 'status' : 'alert'}">${e(message)}</p>${ok ? '' : `<form method="post" action="/api/enquiry">${input('name', 'Name')}${input('email', 'Work email', 'email')}<label for="message">What would you like help with?</label><textarea id="message" name="message" maxlength="5000" required${errors.message ? ' aria-invalid="true" aria-describedby="message-error"' : ''}>${e((fields.message || '').slice(0, LIMITS.message))}</textarea>${errors.message ? `<p id="message-error">${e(errors.message)}</p>` : ''}<input type="hidden" name="source" maxlength="500" value="${e((fields.source || '').slice(0, LIMITS.source))}"><div hidden><label for="website">Leave this blank</label><input id="website" name="website" maxlength="200" tabindex="-1" autocomplete="off"></div><p>We use your details to respond to this enquiry. <a href="/privacy">Privacy</a></p><button class="button" type="submit">Send Enquiry</button></form>`}<p><a href="/contact">Back to contact</a> or <a href="/">return home</a>.</p></main></body></html>`;
}
