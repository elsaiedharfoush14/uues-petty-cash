# Task for Claude Code: publish «عهدة UUES» to GitHub Pages

This folder is a finished, tested static web app (PWA). Do NOT change the app code.
Your job: put it on GitHub Pages under the user's account and give them the live link.

## Target
- GitHub repo: `uues-petty-cash` (public), owner = the user's logged-in GitHub account
- Live URL: `https://<github-username>.github.io/uues-petty-cash/`

## Steps
1. Check tools: `git --version` and `gh --version`.
   - If `gh` is missing, install it (Windows: `winget install --id GitHub.cli`; macOS: `brew install gh`).
   - If `gh auth status` says not logged in, run `gh auth login --web` and tell the user to finish the login
     in the browser, then continue.
2. In THIS folder (the one containing `index.html`):
   ```
   git init -b main
   git add -A
   git commit -m "عهدة UUES - first release"
   ```
3. Create the repo and push (skip create if it already exists — then just add the remote and push):
   ```
   gh repo create uues-petty-cash --public --source . --remote origin --push \
     --description "عهدة UUES — petty cash app for UUES staff"
   ```
4. Turn on GitHub Pages from the `main` branch, root folder:
   ```
   gh api -X POST repos/{owner}/uues-petty-cash/pages -f "source[branch]=main" -f "source[path]=/"
   ```
   (`{owner}` = output of `gh api user --jq .login`. If Pages already exists, use `-X PUT` with the same fields.)
5. Wait for the build (check every 20 s, up to ~5 min):
   ```
   gh api repos/{owner}/uues-petty-cash/pages --jq .status      # wait for "built"
   ```
   Then confirm the site answers 200:
   ```
   curl -s -o /dev/null -w "%{http_code}" https://{owner}.github.io/uues-petty-cash/
   ```
6. Reply to the user IN ARABIC (English terms on their own lines), short:
   - the live link,
   - how to install it on the phone:
     iPhone → open the link in Safari → Share → «Add to Home Screen»;
     Android → open in Chrome → ⋮ → «Install app» / «Add to Home screen».

## Files (all must be in the repo root)
index.html, exceljs.min.js, manifest.webmanifest, sw.js, icon-192.png, icon-512.png,
apple-touch-icon.png, maskable-512.png, README.md, .nojekyll, CLAUDE.md

## Later updates
If the user sends a newer `index.html`, replace it, bump `const CACHE='uues-pc-vN'` in `sw.js` by one,
commit and `git push`. Pages redeploys by itself in ~1 minute.
