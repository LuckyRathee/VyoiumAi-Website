# Enquiry backend

`POST /api/enquiry` accepts `application/json` or `application/x-www-form-urlencoded`. Code: `server.mjs` and `lib/enquiry.mjs`.

## Fields and limits
| Field | Max chars | Required |
| --- | --- | --- |
| `name` | 120 (single line) | yes |
| `email` | 254 | yes |
| `message` | 5000 | yes |
| `source` | 500 (the page path, set by JavaScript) | no |
| `website` | 200 (honeypot; must stay empty) | no |

## Responses
| Status | Meaning |
| --- | --- |
| 200 | SMTP accepted the configured recipient |
| 400 | Invalid body, failed validation or filled honeypot |
| 403 | Cross-origin submission |
| 413 | Body over 32 KB |
| 415 | Unsupported content type |
| 429 | Rate limit exceeded (`Retry-After: 600`) |
| 503 | SMTP not configured or failed, or rate-limit storage unavailable |

If the request sends `Accept: application/json`, the response is JSON: `{ ok, message, errors }`. Otherwise it is an HTML page that keeps the entered fields. Responses never expose provider errors.

## Environment
| Variable | Purpose / default |
| --- | --- |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | SMTP server and credentials |
| `SMTP_PORT` | Default `587` |
| `SMTP_FROM` | Sender address |
| `ENQUIRY_TO` | Business inbox |
| `SMTP_SECURE` | `true` for implicit TLS; defaults to true on port 465 |
| `SMTP_REQUIRE_TLS` | On unless set to `false` |
| `SITE_URL` | Allowed origin and canonical URL |
| `PORT` / `HOST` | Default `4321` / `127.0.0.1` |
| `RATE_LIMIT` | Default 6 attempts per 10 minutes per address |

The server does not load `.env` automatically. Use Node's env-file flag with a git-ignored file:

```bash
node --env-file=.env.local server.mjs
```

## Caveats
- SMTP acceptance does not prove that a person received the email. Verify receipt in the real inbox before launch.
- Behind a reverse proxy, the socket address belongs to the proxy, so all visitors share one rate limit. Add trusted-proxy handling once hosting is known.
- Counter files in `.data/` are never purged. Add retention cleanup.
