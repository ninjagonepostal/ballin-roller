# ballin-roller
Dice roller app

This app will:

- Let you roll dice offline
- Keep your privacy
- Look cool af at your next gaming session

This app will NOT:

- Track your data
- Require you to be online
- Show you ads
- Make you avocado toast

IF you see any ads, discover data is being tracked, aside from keeping a history of your rolls, or requiring you to be online to use it, contact the maintainer IMMEDIATELY

---

# Neon Dice — Native App Project (Android + iOS)

A Capacitor 8 project that wraps the Neon Dice cyberpunk TTRPG dice roller
as a real installable mobile app. The roller itself is plain HTML, CSS, and
vanilla JavaScript in `www/`; Capacitor hosts it in a native WebView shell
with an Android project in `android/` and an Xcode project in `ios/`.

- App name: **Neon Dice**
- App ID: **com.neondice.app** (change it to your own domain before
  publishing — see below)
- Capacitor: 8.x, web directory: `www/`
- No Capacitor plugins are used, so the app makes zero network requests:
  fully offline, no accounts, no tracking. Roll history lives only in the
  device's local storage, exactly like the web version.

## Project layout

```
neon-dice-app/
├── www/                  # the dice roller web app (edit these files)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── android/              # native Android project (Android Studio)
├── ios/                  # native iOS project (Xcode, macOS only)
├── capacitor.config.json # app ID, name, web directory
├── package.json
├── LICENSE               # GNU GPLv3 — see License below
├── CONTRIBUTING.md       # how to contribute, incl. the CLA
└── package-lock.json
```

`node_modules/` is not included in the zip — install it with `npm install`.

## Prerequisites

- Node.js 20+ and npm
- Android: Android Studio (includes the Android SDK) on Windows, macOS,
  or Linux
- iOS: a Mac with Xcode, plus an Apple Developer account for installing on
  a real device or submitting to the App Store

## First-time setup

```bash
cd neon-dice-app
npm install
npx cap sync
```

(`npx cap sync` copies `www/` into both native projects. It was already
run once when this project was built, so this is just to confirm.)

## Run on Android

```bash
npx cap open android
```

Android Studio opens the `android/` project. Pick an emulator or a plugged-in
device and press Run. To make a release build, use
Build > Generate Signed App Bundle / APK in Android Studio and sign it with
your own keystore.

## Run on iOS (macOS + Xcode only)

```bash
npx cap open ios
```

Xcode opens the `ios/` project. Select your development team under
Signing & Capabilities, pick a simulator or device, and press Run.
Building for a real device or the App Store requires an Apple Developer
account ($99/year). iOS builds cannot be done on Windows or Linux.

## Editing the roller

1. Edit the files in `www/` (`index.html`, `styles.css`, `app.js`).
2. Run `npx cap sync` to copy the changes into the Android and iOS projects.
3. Re-run the app from Android Studio / Xcode.

Never edit the copied files under `android/app/src/main/assets/public/` or
`ios/App/App/public/` directly — `npx cap sync` overwrites them.

## Changing the app ID or name

- App name: edit `appName` in `capacitor.config.json`, then run
  `npx cap sync`.
- App ID: edit `appId` in `capacitor.config.json`, then update the native
  projects to match — `namespace` and `applicationId` in
  `android/app/build.gradle`, and the bundle identifier in Xcode
  (select the App target > Signing & Capabilities). Alternatively, delete
  the `android/` and `ios/` folders and re-add them:
  `npx cap add android && npx cap add ios && npx cap sync`.
  Pick your final app ID before publishing: it cannot change once the app
  is on a store.

## App icon and splash screen

The app icon is a neon d20 — Cyberpunk Yellow die with cyan edges and a
"20" on the face, on black. The source artwork lives in `assets/`
(`icon.png` 1024×1024, `splash.png` 2732×2732). To regenerate all the
Android/iOS sizes from those sources:

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#05060a' \
  --splashBackgroundColor '#05060a'
```

See https://capacitorjs.com/docs/guides/splash-screens-and-icons

## License

Neon Dice is free software, licensed under the **GNU General Public License
v3.0 or later** — see `LICENSE`. Copyright (C) 2026 David "MajteK"
Alexander. The source is free for anyone to read, build, and use; the $2
app-store install is for the packaged build. Contributions are welcome under
the Contributor License Agreement in `CONTRIBUTING.md`.

## Privacy

- Rolls use the device's crypto random generator.
- History (up to 100 rolls) is stored only in the WebView's local storage
  on the device. CLEAR wipes it.
- No user, account, or device/OS data is recorded, and nothing leaves the
  device. There are no analytics, ads, or third-party SDKs.
- The web code contains zero external URLs (system fonts only).

## Handy commands

```bash
npm run sync          # copy www/ into the native projects
npm run open:android  # open the Android project in Android Studio
npm run open:ios      # open the iOS project in Xcode (macOS only)
npx cap doctor        # check your environment for issues
```
