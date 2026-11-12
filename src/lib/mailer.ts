import nodemailer from 'nodemailer';

export function isEmailConfigured() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO);
}

export function getMailTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.EMAIL_PORT || 465);
  const secure =
    process.env.EMAIL_SECURE !== undefined
      ? process.env.EMAIL_SECURE === 'true'
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export function getFromAddress(label?: string) {
  const fromName = process.env.EMAIL_FROM_NAME || 'Quran Reading System';
  const displayName = label ? `${fromName} — ${label}` : fromName;
  return `"${displayName}" <${process.env.EMAIL_USER}>`;
}

export async function sendAppMail(options: {
  to?: string;
  subject: string;
  html: string;
  replyTo?: string;
  label?: string;
}) {
  if (!isEmailConfigured()) {
    throw new Error('Email service not configured');
  }

  const transporter = getMailTransporter();
  return transporter.sendMail({
    from: getFromAddress(options.label),
    to: options.to || process.env.EMAIL_TO,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });
}
