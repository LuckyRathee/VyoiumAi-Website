# Security

## Controls in place
- **Response headers:** a CSP that allows only same-origin scripts and styles, plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` and `Permissions-Policy` (camera, microphone and geolocation disabled).
- **Static serving:** path-traversal protection; methods other than GET and HEAD are rejected.
- **Enquiry endpoint:**
  - origin check and honeypot
  - 32 KB body cap and strict content types
  - field validation, a header-injection guard on the name field and HTML escaping
  - persisted rate limiting
- **SMTP:** secrets are read only from the server environment, and TLS is required by default.
- **Error handling:** error responses never reveal provider details or message contents.

## Known gaps
- No HSTS yet; it needs HTTPS hosting.
- The rate limiter keys on the socket address, which is not proxy-aware.
- Rate-limit files are never cleaned up.
- There is no CSRF token. Origin checks mitigate this, and the form has no authenticated session.
- Run `npm audit` before each release.

## Reporting
There is no public disclosure address yet. Report issues to the founder directly.
