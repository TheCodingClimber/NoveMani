# Nove Mani

A Vite + React landing page for Nove Mani, refreshed with a more deliberate visual system and a `three.js` hero scene that gives us room to grow into richer animation work.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

## Inquiry Email

Create a local `.env` file from `.env.example` and configure Resend:

- `RESEND_API_KEY` is the private API key from Resend.
- `RESEND_FROM` is the verified sender address in Resend.
- `INQUIRY_EMAIL` is the inbox that receives website inquiries.
- `VITE_INQUIRY_ENDPOINT` can override the default `/api/send-inquiry` endpoint.

Keep `RESEND_API_KEY` server-side only. Do not prefix it with `VITE_`.

The included `api/send-inquiry.js` endpoint works on hosts that support Vercel-style serverless functions. On other static hosts, deploy the API separately and set `VITE_INQUIRY_ENDPOINT` to that URL.

## Security

- `vercel.json` defines production security headers, including CSP, HSTS, frame denial, content sniffing protection, and a restrictive permissions policy.
- The CSP allows the two inline JSON-LD blocks by SHA-256 hash. If those structured-data scripts change, update the matching `script-src` hashes in `vercel.json`.
- The inquiry endpoint only accepts JSON POST bodies, caps payload size, strips control characters, escapes email HTML, and keeps provider errors out of browser responses.
- Rate limiting is intentionally lightweight because serverless memory is ephemeral. For heavy traffic or active abuse, add host-level protection such as Vercel WAF, Turnstile, or a durable rate-limit store.

### Troubleshooting

- Plain `npm run dev` only starts Vite and does not run the `/api/send-inquiry` serverless function.
- If you use `onboarding@resend.dev`, Resend may only allow sends to the account owner's email. Verify a domain in Resend before sending to arbitrary recipients in production.
- If the form reports a `404`, the host is not serving the API function.
- If the form reports a Resend permission or domain error, update `RESEND_FROM` to an address on a verified sending domain.

## Notes

- The hero animation is mounted with `three.js` and cleaned up on unmount.
- Reduced-motion users get a static render instead of a continuously animated scene.
- The contact form sends each inquiry through the private Resend API endpoint.
