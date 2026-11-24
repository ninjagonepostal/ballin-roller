# AGENTS.md — Ballin' Roller

Instructions for any coding agent (OpenCode, Claude Code, Cursor, Copilot, or Muse) working on this project. Read this file before editing anything.

## What this is

Ballin' Roller is a Cyberpunk 2077-themed TTRPG dice roller, wrapped as a native mobile app with Capacitor 8. The roller itself is plain HTML, CSS, and vanilla JavaScript — no framework, no build step for the web code, no dependencies beyond Capacitor for the native shell.

- App name: **Ballin' Roller**
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

1. **Fully offline. Zero external requests.** No Google Fonts, no CDNs, no analytics, no third-party SDKs. System fonts only. Verify with a search for `http` / `https` URLs in `www/` after any change.
2. **No data about the user, their accounts, or their device/OS is ever recorded.** No analytics, no tracking, no identifiers.
3. **Roll history stays on-device only.** History (up to 100 rolls, newest first, key `ballin-roller-history-v1`) lives in the WebView's local storage and never leaves the device. No server, no sync, no cloud backup. The CLEAR button must wipe it.
4. **Rolls use the device's crypto random generator** (`crypto.getRandomValues`), not `Math.random`.

## Design rules

- **Compact two-column layout on a vertical phone screen.** Left column: dice list. Right column: history. Both must fit side-by-side without horizontal scrolling.
- **Each die type has a unique Cyberpunk 2077 color**, ranked by die popularity / marketing appeal — most-rolled dice get the most eye-catching colors. Do not reassign colors casually; if a color change is requested, keep every die unique and keep the ranking. Current mapping (in `www/app.js`, `DICE`):
  - d20 — Cyberpunk Yellow `#fcee0a`
  - d6 — Arasaka Red `#ff003c`
  - d10 — Neon Cyan `#00e5ff`
  - d8 — Neon Pink `#ff2e9e`
  - d100 — Ultraviolet `#b967ff`
  - d4 — Toxic Green `#39ff14`
  - d12 — Neon Orange `#ff7a00`
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
- The app icon is a neon d20 (Cyberpunk Yellow die, cyan edges, "20" on the face). Sources live in `assets/` (`icon.png` 1024×1024, `splash.png` 2732×2732); regenerate all sizes with `npx capacitor-assets generate` — see README.md.
