# عهدة UUES (UUES Petty Cash) — handover for Claude Code

A live, installable web app (PWA) used by UUES staff to record petty-cash custodies by voice and export the
official **UUES EXPENSES REPORT** form (Excel / PDF). Built and maintained with Claude Code for
**Eng. Elsayed Harfoush** (UUES automation engineer). Reply to him in **Egyptian Arabic**, short, with English
terms on their own lines. He is not a CLI user: **do the work yourself** (run git / gh / tests) — never hand him
shell commands to paste.

## Two Claude accounts — keep everything synced (he switches accounts when credit runs out)
He works on this repo from two Claude Pro accounts (Gmail + Apple). The other account knows ONLY what is in
this repo, so GitHub is the single source of truth — never leave work only in the chat or a local folder.
- **Start of every session:** `git pull` on main, then `git fetch origin wip` — if a `wip` branch exists,
  unfinished work is waiting: check it out, read the «⏸️ Handoff» note below, continue from there.
- **After every finished task:** update «Status» below (one short line), commit, push to `main`, and confirm
  the push succeeded. Do this without being asked.
- **Unfinished work** (he says «سلّم» / «هبدّل» / «الرصيد بيخلص», or a session is ending mid-task): do NOT
  push half-done code to `main` — main is LIVE for all colleagues. Commit it to branch `wip`, push, and write
  a «⏸️ Handoff» line under Status: what's done, what's left, the exact next step. When that work is finished,
  merge `wip` into `main`, delete `wip`, and remove the handoff line.
- After pushing, tell him in one line that everything is uploaded.
- **Session log** (chats don't move between accounts, so this list replaces them): every session adds ONE
  line at the top of `SESSIONS.md` — `YYYY-MM-DD HH:MM · <short Arabic title of what he asked> · <what was done>
  · <open item, if any>` — and pushes it with the rest. When he asks «المحادثات» / «سجل الجلسات» / «كنا بنعمل
  إيه», show him the latest lines as a numbered list; when he picks one, continue that work.

## Status
- **v2026.10.06.2**: his iPhone showed Safari «FetchEvent.respondWith received an error: Returned response is null»
  — the old «حدّث» deleted ALL caches, then the network failed, and the SW answered `caches.match()` = undefined.
  Now `sw.js` never answers empty (saved page → built-in «النت مش واصل» page), caches only ok/basic pages,
  and `hardUpdate()` checks the network first and no longer deletes caches. NEVER tell him to clear Safari
  website data — that deletes his custodies (localStorage).
- **v2026.10.06.1**: .10 never went live — GitHub Pages build failed on GitHub's side («job was not acquired by
  Runner»); check `gh run list --repo elsaiedharfoush14/uues-petty-cash` after a push, rerun if it failed.
  In-app mic on iPhone: iOS speech has no ar-EG → `micLang` = ar-SA on iPhone (and fallback on
  «language-not-supported»); other mic errors are shown with their code instead of a silent «on» mic.
  His earlier success was the iOS KEYBOARD mic (text with ‎ marks) + «ضيفها», not the in-app mic.
- **v2026.10.05.10** (his picks 1,2,3,5,6 of my suggestions):
  ✍️ signature pad in ⚙️ (`sigOpen`, trimmed PNG in data `o.sig` → backups carry it) drawn on `sigPart` + Excel `ids.sig`;
  🧾 receipt photos (IndexedDB `PDB`) as extra A4 pages after each form, 2 per page, grayscale (`photoJobs`/`photoCanvas`);
  📅 `item.date` per invoice: voice «… يوم 3» / «امبارح …» (`parseItems` markers → `dd`, `splitDates`, `itemDate`), date chip
  with native picker on each row, manual-add date, form/Excel Date column uses it, items sorted by date inside a type;
  a lone «يوم 30» with no invoices still sets the custody date (old behaviour);
  📷 receipt reader = Tesseract.js 5.1.1 from jsdelivr (eng+ara, ~10 MB first time, he CHOSE free over Claude API) →
  `readReceipt()` (total/type/date/merchant) → editable card → item + photo; 💾 weekly backup screen `#bkOv`
  (`uues_bk` > 7 days, «بعدين» = `uues_bk_snooze` today) → `bkBtn` share sheet. He declined Google-Drive auto backup.
- **v2026.10.05.9**: .9 = install QR `qr-install.png` (→ `…/?i=1`, made by
  `E:\Work\Automation_Tools\petty_cash_app\qrgen.py`, verify with jsQR) in About + A4 poster (`qrPosterCanvas`);
  `?i=1` opens the `#getApp` page (Android: native `beforeinstallprompt` button; iPhone: Apple allows no install
  button → steps + arrow to Safari's share button; in-app browser: open in Safari/Chrome + copy link).
  He wants ONLY the UUES logo in colour in printed output (picture/PDF + Excel use `LOGO`); the rest stays B&W.
- .8 = PDF + «👁️ عرض» are now canvas pictures (see Exports).
- (earlier) **v2026.10.05.7** (.6/.7 = HE USES AN iPHONE: iOS dictation wraps numbers in invisible bidi
  marks «‎280‎» → `cleanSpeech()` in `normDigits` (NFKC, drop \p{Cf}, Persian digits, «فندق280» split); «ما فهمتش»
  shows unknown char codes [U+…] — ask him for a screenshot of it) (tag `v2026.10.05-stable` = .2; .3–.5 = voice-add fix in a custody:
  no preview — «ضيفها» (button or said, `ADD_CMD` regex) adds at once with «تراجع»; and when the custody mic
  STOPS (tap, or the phone ends it) the box is added automatically (`mic(...,after)`; ✕ / abort = no add).
  Lesson: he tests on a real Android phone, where the mic stops after pauses — test that path (onend), not only
  a happy-path mock, and click through the real UI (العهد ← custody ← اتكلم) before saying it works.
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
  PDF / preview: `custodyCanvas(c)` / `summaryCanvas(list)` DRAW the form on a 300-dpi A4 canvas (`drawTable`
  helper, sizes in mm, `fit` shrinks a cell's font, rows grow for wrapped text, `layPage` scales a too-long page
  to fit) → `makePages()` PNG files → «🖨️ PDF» = `printFiles()` puts the PNGs in `#printArea` (@page margin 0,
  img width 100%, one per page) + `window.print()`; «👁️ عرض» = `#pvOv` overlay with Share (navigator.share
  files → WhatsApp / Print / Save Image on iPhone), Print / PDF, Save. Replaced the old HTML print because it
  overflowed the page on iPhone. **Output must stay BLACK & WHITE** (grayscale logos via `grayImgs()`), same
  layout as the original UUES form, thick frame. Test: `makePages(...)` → POST blob to savesrv → view PNG;
  print check = HTML with the same print CSS + PNGs → headless Edge `--print-to-pdf` (own --user-data-dir) → page count.

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
