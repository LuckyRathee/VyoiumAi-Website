# Development

You need Node.js 22+. Browser tests also need Google Chrome.

```bash
npm ci
npm run build
node dev.mjs
```

`node dev.mjs` serves http://localhost:4321, rebuilds and reloads on every change, and runs the enquiry API on port 4322.

To run the standalone server instead: `npm run build && npm start`. It listens on 127.0.0.1:4321.

## Checks
```bash
npm test
npm run test:browser
npm audit
```

- `npm test` runs the 15 unit and integration tests.
- `npm run test:browser` needs the dev server running. It saves screenshots to `artifacts/`.

## Branching
- Work and commit on `dev`.
- `main` changes only for an approved release.
- Repository: https://github.com/LuckyRathee/VyoiumAi-Website
- Keep the local folder spelling `VyouimAi-website`.

## Conventions
- Use conventional commit prefixes: `feat:`, `fix:`, `docs:`.
- Use no inline scripts or styles, because the CSP blocks them.
- Never commit secrets, `dist/`, `.data/`, logs or screenshots.
- Build and run the tests before committing a milestone.
