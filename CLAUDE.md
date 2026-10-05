# عهدة UUES (UUES Petty Cash) — handover for Claude Code

A live, installable web app (PWA) used by UUES staff to record petty-cash custodies by voice and export the
official **UUES EXPENSES REPORT** form (Excel / PDF). Built and maintained with Claude Code for
**Eng. Elsayed Harfoush** (UUES automation engineer). Reply to him in **Egyptian Arabic**, short, with English
terms on their own lines. He is not a CLI user: **do the work yourself** (run git / gh / tests) — never hand him
shell commands to paste.

## Status
- **STABLE / FROZEN at v2026.10.05.2**, git tag `v2026.10.05-stable` (previous: `v2026.10.04-stable`).
  He said «نثبت على كده» — change nothing unless he asks; when he asks, keep every feature below working.
- Live: https://elsaiedharfoush14.github.io/uues-petty-cash/ — repo `elsaiedharfoush14/uues-petty-cash` (public),
  GitHub Pages from `main` / root. Shared with colleagues; every push reaches all of them.

## Files
| File | What |
|---|---|
| `index.html` | the whole app (HTML + CSS + JS, ~2000 lines). `LOGO` / `NAME` base64 consts = official form images |
| `sw.js` | service worker, `CACHE='uues-pc-vN'`; `version.json` is never cached |
| `version.json` | `{"v": APP_VER}` — the app shows a green «فيه تحديث» bar when it differs from `APP_VER` |
| `exceljs.min.js` | Excel export (lazy-loaded) · `jsQR.js` QR scanner (lazy) |
| `logo-full.png`, `logo-mark.png` | United Utilities logo (header, About, splash) |
| `icon-*.png`, `apple-touch-icon.png`, `maskable-512.png` | app icon = the ORIGINAL UUES icon (he rejected a new one) |
| `og-image.png` | WhatsApp link preview |
| `UUES_Ohda_App.zip` | old package — intentionally NOT tracked |

## Release procedure (always all three, then push)
1. `const APP_VER='YYYY.MM.DD.N'` in `index.html`
2. `version.json` → same value
3. `const CACHE='uues-pc-vN'` in `sw.js` → N+1

Commit, `git push origin main`, then poll `https://elsaiedharfoush14.github.io/uues-petty-cash/version.json` until the
new value is served (~1 min). Commit email: `332831565+elsaiedharfoush14@users.noreply.github.com`.
On Windows refresh PATH first: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`.
Creating new public repos/sites needs his explicit OK; pushing updates to this repo is routine.

## App structure (index.html)
- **Splash** (once per launch) with tagline «سجّل عهدتك بصوتك… والباقي علينا» + signature; **first-run tour** (3 slides, `uues_tour`).
- **4 tabs** (bottom bar): `home` (year total, stats, smart reminders, 💰 cash balance, insights chart, by-project,
  latest), `listView` (search + filter الكل/لسه/اتسلمت, Excel/PDF for all), `addView` (voice card, «جرّب بالمثال»,
  manual form), `aboutView` (version + update, language, ⚙️ settings: meal allowance + projects, credits
  «م. السيد حرفوش / Eng. Elsayed Harfoush», changelog, backup / restore / 📷 QR import, share, install help).
  Sub-pages `sheet` (one custody) and `newView`; phone back button works (history state).
- **Voice**: Web Speech API, `ar-EG` (or `en-US` in English). Mic keeps listening across pauses until tapped;
  Android duplicate-phrase fix. Parser: `parseItems` (Egyptian number words, «سبعة وسبعين واتناشر»=77.12),
  `extractDates` (من/لحد/لـ/للنهاردة/امبارح/أول الشهر/الشهر اللي فات/month names/«from … to …»).
- **Money**: meals = days × meal rate (`RATE` from settings, per-custody `c.mealRate`). Cash balance =
  receipts ledger (`o.receipts`) − total spent → >0 «معاك للشركة» (Debit), <0 «ليك عند الشركة» (Credit).
  `c.advance` per report → Excel/PDF «Less Advance Received».
- **Language**: page is written in Arabic; English via `EN{}` dictionary + MutationObserver; texts with numbers use
  `tr(ar, en)`. **Every new Arabic UI string needs an `EN` entry.** Switch = `setLang()` → reload.
- **Storage**: `localStorage` key `uues_pc_v1` = `{name, custodies{}, projects{}, receipts{}}` on each phone only;
  receipt photos in IndexedDB. Backup = JSON file; import also via `#import=<base64url JSON>` link / in-app QR scan.
  Nobody (including Claude) can read a phone's data — ask for a backup file.
- **Exports**: `exportXlsx(id?)` (one custody, or all + `Summary` + `Advances` sheets);
  `pdfPage()` / `pdfSummary()` → `#printArea` + `@media print` + `window.print()` («Save as PDF»).
  **Printed output must stay BLACK & WHITE** (no fills, grayscale logos via `grayImgs()`), same layout as the
  original UUES form, thick frame around the form. Print CSS classes must not reuse app class names.

## Testing (Windows PC, tools in `E:\Work\Automation_Tools\petty_cash_app`)
- `python savesrv.py` → serves this folder on http://localhost:8765 and saves `POST /save?name=x` bodies to `out\`.
- Built-in browser, mobile preset (375×812). Mock `SpeechRecognition` / `getUserMedia` (no real mic or camera).
  Set `sessionStorage.uues_sp='1'` and `localStorage.uues_tour='1'` to skip splash/tour.
- Excel → PNG: `xl2png.ps1 -xlsx file -outDir dir` (Excel COM + PyMuPDF; no LibreOffice on this PC).
- PDF → PNG: capture the DOM after clicking a PDF button (with `window.print=()=>{}`), POST it, then
  `html2pdf.ps1 -html file -outDir dir` (headless Edge).
- Before publishing: no console errors, English mode has no Arabic left (except the language switch / names),
  totals re-computed by hand.

## History (short)
2026-10-03 first publish → new look, spoken dates, mic fixes, QR import of old custodies (from the earlier
claude.ai artifact app). 2026-10-04 tabs, AR/EN, cash balance, logo, insights, reminders, tour, settings,
summary share, Excel form frame. 2026-10-05 PDF printing (one / all), black & white output.
