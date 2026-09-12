# Knock Knock — Ledger terminal reveal

A full-screen, monochrome interactive terminal sequence. The visitor types three messages; the interface answers the first two, pauses after the third, then slowly reconstructs the Ledger mark from code-like fragments. The final mark—including all four Ledger corner brackets—is generated entirely in canvas and never switches to a raster image.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static web server.

## Interaction

1. Type `knock knock` and press Enter.
2. Type a real name using English letters only and press Enter.
3. Enter one of the five accepted secrets: `nyknyc`, `self custody`, `no compromise`, `don't trust, verify`, or `ownership`.
4. Wait for the reveal. Press Escape after the sequence to restart.

The responses are driven by the order of messages, so the experience remains easy to perform live even if capitalization changes slightly. The name field accepts English letters only. Non-Latin writing, offensive English or Finglish terms, obfuscated profanity, repeated characters, and obvious keyboard mash are rejected at the name step.

After the name, the terminal asks `what's the secret ?`. The Ledger reveal runs only for one of the five accepted secrets. Other phrases receive no response and leave the prompt open for another attempt.

## Optional Vercel deployment

The repository is ready to import into Vercel whenever deployment is wanted. Use these project settings:

- Framework preset: `Other`
- Root directory: repository root
- Build command: leave empty
- Output directory: leave empty
- Install command: leave empty

No environment variables, server functions, packages, or external services are required. `vercel.json` provides clean URLs and restrictive security headers. The local `.vercel` directory is ignored so account-specific deployment metadata will never be committed.

