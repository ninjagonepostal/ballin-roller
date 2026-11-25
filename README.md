# ballin-roller

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ninjagonepostal/ballin-roller/blob/dev/package.json)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

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

# Ballin Roller — Native App Project (Android + iOS)

A Capacitor 8 project that wraps the Ballin Roller cyberpunk TTRPG dice roller
as a real installable mobile app. The roller itself is plain HTML, CSS, and
vanilla JavaScript in `www/`; Capacitor hosts it in a native WebView shell
with an Android project in `android/` and an Xcode project in `ios/`.

- App name: **Ballin Roller**
- App ID: **com.ballinroller.app** (change it to your own domain before
  publishing — see below)
- Capacitor: 8.x, web directory: `www/`
- No Capacitor plugins are used, so the app makes zero network requests:
  fully offline, no accounts, no tracking. Roll history lives only in the
  device's local storage, exactly like the web version.

## Project layout

```
ballin-roller/
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
git clone -b dev https://github.com/ninjagonepostal/ballin-roller.git
cd ballin-roller
npm install
npx cap sync
```

Clone the `dev` branch — `main` only has the license and README, the
project itself lives on `dev`.

(`npx cap sync` copies `www/` into both native projects. It was already
run once when this project was built, so this is just to confirm.)

## Compile and run

### Android — first run

1. Follow First-time setup above, then create an emulator (skip to the
   real-device steps below if you'd rather test on a phone). In Android
   Studio, open Device Manager and create a virtual device — a Pixel
   with an Android 17 (API 37) system image works. The project compiles
   against SDK 36, so Android Studio may also prompt you to install the
   Android 16 (API 36) platform; accept that. The emulator needs
   virtualization on: Windows Hypervisor Platform enabled in Windows
   Features, and virtualization turned on in BIOS.

2. Open the Android project:

   ```bash
   npx cap open android
   ```

   Let the first Gradle sync finish — it downloads Gradle and the
   project dependencies, so the first one takes a few minutes. Then pick
   your emulator in the device dropdown and press Run (or Shift+F10).
   The app builds, installs, and launches on the emulator.

   To make a release build, use Build > Generate Signed App Bundle / APK
   in Android Studio and sign it with your own keystore.

### Android — real device

1. On the phone: Settings → About phone → tap Build number 7 times to
   enable Developer Options, then Settings → System → Developer
   options → turn on USB debugging.
2. Plug the phone in by USB and accept the "Allow USB debugging?"
   prompt (tick "Always allow from this computer").
3. In Android Studio, pick the phone in the device dropdown and press
   Run. The app installs and stays on the phone like any other app;
   re-running from Android Studio updates it.

   If the phone doesn't show up: try a different cable (some are
   charge-only), check `adb devices` in Android Studio's terminal (the
   device should list as `device`; `unauthorized` means the prompt on
   the phone wasn't accepted), and make sure the Google USB Driver is
   installed (SDK Manager → SDK Tools). Samsung phones sometimes need
   Samsung's own driver instead.

### After changing the web code

```bash
npx cap sync
```

Then re-run from Android Studio / Xcode. `npx cap sync` is what copies
`www/` into the native projects, so a rebuild without it tests the old
code.

## Run on iOS (macOS + Xcode only)

```bash
npx cap open ios
```

Xcode opens the `ios/` project. Select your development team under
Signing & Capabilities, pick a simulator or device, and press Run.
Building for a real device or the App Store requires an Apple Developer
account ($99/year). iOS builds cannot be done on Windows or Linux.

## Troubleshooting

- **Android Studio offers an AGP upgrade or a Gradle Daemon toolchain
  migration:** skip both. The project pins AGP 8.13.0, the version
  Capacitor 8.6.2 is tested against — upgrading it can break the build.
  Take AGP upgrades when a Capacitor release bumps the pinned version.
- **Build fails after changing the app ID:** the saved run configuration
  still points at the old package. Run → Edit Configurations → delete
  the `app` configuration, then Run again so Android Studio creates a
  fresh one. If it still complains, File → Invalidate Caches →
  Invalidate and Restart.
- **Build fails with `Can not extract resource from ... ParsedResource`:**
  a string resource has a character AAPT can't handle — the usual one
  is an unescaped apostrophe in `strings.xml`. Keep apostrophes out of
  the app name (see "Changing the app ID or name" below).
- **Build is slow or acts stale:** clean it — Build → Clean Project in
  Android Studio, or `cd android && ./gradlew clean` from a terminal
  (PowerShell: `.\gradlew clean`).
- **`git pull` blocked by local changes to the two generated
  `capacitor.config.json` copies** (`android/app/src/main/assets/` and
  `ios/App/App/`): those files are regenerated by `npx cap sync`, so
  your local copies just differ from the repo's. Discard them and pull
  again — check `git status` first to confirm they're the only local
  changes:

  ```bash
  git restore android/app/src/main/assets/capacitor.config.json ios/App/App/capacitor.config.json
  git pull
  npx cap sync
  ```

  Run `npx cap sync` again after the pull so the local copies match the
  pulled state. Pulling before running `cap sync` avoids the block
  entirely.

## Editing the roller

1. Edit the files in `www/` (`index.html`, `styles.css`, `app.js`).
2. Run `npx cap sync` to copy the changes into the Android and iOS projects.
3. Re-run the app from Android Studio / Xcode.

Never edit the copied files under `android/app/src/main/assets/public/` or
`ios/App/App/public/` directly — `npx cap sync` overwrites them.

## Changing the app ID or name

- App name: edit `appName` in `capacitor.config.json`, then run
  `npx cap sync`. Avoid apostrophes in the app name — Android's
  resource compiler rejects unescaped apostrophes in string resources
  and the build fails.
- App ID: edit `appId` in `capacitor.config.json`, then update the native
  projects to match — `namespace` and `applicationId` in
  `android/app/build.gradle`, and the bundle identifier in Xcode
  (select the App target > Signing & Capabilities). Alternatively, delete
  the `android/` and `ios/` folders and re-add them:
  `npx cap add android && npx cap add ios && npx cap sync`.
  Pick your final app ID before publishing: it cannot change once the app
  is on a store.

## App icon and splash screen

The app icon is a neon d20 — yellow die with cyan edges and a
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

Ballin Roller is free software, licensed under the **GNU General Public License
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
