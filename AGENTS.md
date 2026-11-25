# AGENTS.md — Ballin Roller

Instructions for any coding agent (OpenCode, Claude Code, Cursor, Copilot, or Muse) working on this project. Read this file before editing anything.

## What this is

Ballin Roller is a cyberpunk-inspired TTRPG dice roller, wrapped as a native mobile app with Capacitor 8. The roller itself is plain HTML, CSS, and vanilla JavaScript — no framework, no build step for the web code, no dependencies beyond Capacitor for the native shell.

- App name: **Ballin Roller**
- App ID: `com.ballinroller.app` (change before publishing; see README.md)
- Capacitor: 8.x, web directory: `www/`

## Project layout

```
ballin-roller/
├── www/                  # the dice roller — edit THESE files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── android/              # native Android project (Android Studio)
├── ios/                  # native iOS project (Xcode, macOS only)
├── capacitor.config.json # app ID, name, web directory
├── package.json
└── README.md             # build / run / publish instructions
```

## How to change the roller

1. Edit only the files in `www/` (`index.html`, `styles.css`, `app.js`).
2. Run `npx cap sync` to copy the changes into the Android and iOS projects.
3. Re-run from Android Studio / Xcode.

Never edit the copied files under `android/app/src/main/assets/public/` or `ios/App/App/public/` directly — `npx cap sync` overwrites them.

## Hard rules — do not break these

These are the owner's firm requirements. A change that violates one is wrong even if it looks better.

1. **Fully offline. Zero external requests.** No Google Fonts, no CDNs, no analytics, no third-party SDKs. System fonts only. Verify with a search for `http` / `https` URLs in `www/` after any change. Exception (2026-11-25): the footer Privacy Policy link (`https://ninjagonepostal.github.io/ballin-roller/`) is the single allowed external URL — Google Play requires the policy linked inside the app. It makes no request unless the user taps it. Do not remove it.
2. **No data about the user, their accounts, or their device/OS is ever recorded.** No analytics, no tracking, no identifiers.
3. **Roll history stays on-device only.** History (up to 100 rolls, newest first, key `ballin-roller-history-v1`) lives in the WebView's local storage and never leaves the device. No server, no sync, no cloud backup. The CLEAR button must wipe it.
4. **Rolls use the device's crypto random generator** (`crypto.getRandomValues`), not `Math.random`.

## Design rules

- **Compact two-column layout on a vertical phone screen.** Left column: dice list. Right column: history. Both must fit side-by-side without horizontal scrolling.
- **Each die type has a unique neon color**, ranked by die popularity / marketing appeal — most-rolled dice get the most eye-catching colors. Do not reassign colors casually; if a color change is requested, keep every die unique and keep the ranking. Current mapping (in `www/app.js`, `DICE`):
  - d20 — yellow `#fcee0a`
  - d6 — red `#ff003c`
  - d10 — cyan `#00e5ff`
  - d8 — pink `#ff2e9e`
  - d100 — violet `#b967ff`
  - d4 — green `#39ff14`
  - d12 — orange `#ff7a00`
  - The color flows through the die, its QTY/MOD steppers, its ROLL button, and its history rows.
- **History shows the equation, not number squares.** Highlight the highest roll in yellow and the lowest in pink within the equation. Keep the NAT 20 / NAT 1 badges.
- Keep the layout compact: small dice, vertical QTY and MOD steppers, narrow ROLL buttons.

## Build

```bash
cd ballin-roller
npm install        # required first — node_modules/ is not in the zip
npx cap sync
npx cap open android   # Android Studio
npx cap open ios       # Xcode, macOS only
```

- iOS builds need a Mac with Xcode. Installing on a real iPhone or submitting to the App Store needs an Apple Developer account.
- `npx cap doctor` checks the environment for issues.
- The app icon is a neon d20 (yellow die, cyan edges, "20" on the face). Sources live in `assets/` (`icon.png` 1024×1024, `splash.png` 2732×2732); regenerate all sizes with `npx capacitor-assets generate` — see README.md.

## Notes from live device testing (2026-11-25)

- **No Android permissions.** The Capacitor default `INTERNET` permission was removed from `android/app/src/main/AndroidManifest.xml` — the app makes no network requests. Do not re-add it; if the app ever fails to load, this is the first thing to check.
- **No cloud backup.** `android:allowBackup` is `false` in the manifest — no app data is worth backing up, and roll history stays off Google's backup servers.
- **No Advertising ID.** No ad or analytics SDKs, no `AD_ID` permission, no Play services dependency — answer "No" on the Play advertising ID declaration.
- **Scrolling on touch devices.** The page itself does not scroll — `.wrap` is the scroll container (`overflow-y:auto`) and its height ends above the Android navigation bar, so content never slides under the nav buttons. Padding at the end of the page alone does NOT fix this (rows still pass under the bar mid-scroll). Do not move scrolling back to the body.
- **No branded color names.** All color names were scrubbed from the code and docs on 2026-11-25. Dice are identified by hex color only — do not reintroduce trademarked color names.
