import { Resend } from "resend";

const recipientEmail = process.env.INQUIRY_EMAIL || "Ra@NoveMani.onmicrosoft.com";
const fromEmail = process.env.RESEND_FROM;
const resendApiKey = process.env.RESEND_API_KEY;
const maxJsonBytes = 16 * 1024;
const rateLimitWindowMs = 60 * 1000;
const rateLimitMax = 5;
const submissionsByIp = new Map();

const stripControlCharacters = (value) =>
  Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code === 10 || (code > 31 && code !== 127);
    })
    .join("");

const clean = (value, maxLength = 2000, { multiline = false } = {}) => {
  const normalized = String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(stripControlCharacters)
    .join("\n")
    .trim()
    .slice(0, maxLength);

  return multiline ? normalized : normalized.replace(/\n+/g, " ");
};

const escapeHtml = (value) =>
  clean(value, 6000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const isEmail = (value) => value.length <= 180 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const readBody = (request) => {
  if (typeof request.body === "string") {
    return JSON.parse(request.body || "{}");
  }

  return request.body ?? {};
};

const getClientIp = (request) => {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.split(",")[0]?.trim();
  }

  return forwardedFor?.split(",")[0]?.trim() || request.socket?.remoteAddress || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const recentSubmissions = (submissionsByIp.get(ip) || []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs,
  );

  if (recentSubmissions.length >= rateLimitMax) {
    submissionsByIp.set(ip, recentSubmissions);
    return true;
  }

  recentSubmissions.push(now);
  submissionsByIp.set(ip, recentSubmissions);
  return false;
};

const setSecurityHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
};

const getErrorMessage = (error) => {
  if (!error) {
    return "Resend rejected the email request.";
  }

  if (typeof error === "string") {
    return error;
  }

  return error.message || error.name || "Resend rejected the email request.";
};

export default async function handler(request, response) {
  setSecurityHeaders(response);

  if (request.method === "OPTIONS") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!resendApiKey || !fromEmail) {
    console.error("Inquiry email is not configured. Missing RESEND_API_KEY or RESEND_FROM.");
    return response.status(500).json({ error: "Email is not configured." });
  }

  const contentType = request.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return response.status(415).json({ error: "Content-Type must be application/json." });
  }

  const contentLength = Number(request.headers["content-length"] || 0);

  if (contentLength > maxJsonBytes) {
    return response.status(413).json({ error: "Inquiry payload is too large." });
  }

  if (isRateLimited(getClientIp(request))) {
    return response.status(429).json({ error: "Too many inquiry attempts. Try again shortly." });
  }

  let body;

  try {
    body = readBody(request);
  } catch {
    return response.status(400).json({ error: "Invalid JSON body." });
  }

  const { name, email, focus, message, company } = body;

  if (company) {
    return response.status(200).json({ ok: true });
  }

  const inquiry = {
    name: clean(name, 120),
    email: clean(email, 180).toLowerCase(),
    focus: clean(focus, 180),
    message: clean(message, 4000, { multiline: true }),
  };

  if (!inquiry.name || !isEmail(inquiry.email) || !inquiry.focus || !inquiry.message) {
    return response.status(400).json({ error: "Missing or invalid inquiry fields." });
  }

  const brief = [
    "NOVE MANI // INBOUND BRIEF",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Focus: ${inquiry.focus}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");

  const resend = new Resend(resendApiKey);
  let result;

  try {
    result = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: `Nove Mani inquiry: ${inquiry.focus}`,
      replyTo: inquiry.email,
      text: brief,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h1 style="font-size: 20px; margin: 0 0 16px;">Nove Mani inbound brief</h1>
          <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
          <p><strong>Focus:</strong> ${escapeHtml(inquiry.focus)}</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${escapeHtml(inquiry.message)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Inquiry email send failed.", getErrorMessage(error));
    return response.status(502).json({ error: "The email service was unavailable." });
  }

  const { data, error } = result;

  if (error) {
    console.error("Inquiry email provider rejected the message.", getErrorMessage(error));
    return response.status(502).json({ error: "The email service was unavailable." });
  }

  return response.status(200).json({ ok: true, id: data?.id });
}
