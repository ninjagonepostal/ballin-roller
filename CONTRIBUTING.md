# Contributing to Ballin' Roller

Ballin' Roller is a Cyberpunk 2077-themed TTRPG dice roller, plain HTML/CSS/vanilla
JavaScript wrapped as a native app with Capacitor 8. Before contributing, read
`AGENTS.md` — especially the hard rules: fully offline with zero external
requests, no data about the user / their accounts / their device is ever
recorded, roll history stays on-device only, and rolls use
`crypto.getRandomValues`.

## License

Ballin' Roller is licensed under the **GNU General Public License v3.0 or later**
(GPLv3+). See `LICENSE`. Copyright (C) 2026 David "MajteK" Alexander.

The source is free — anyone can read it, build it, and use it. The $2
app-store install pays for the packaged build and for keeping development
going; it does not buy the code, and it does not buy your data, because the
app collects none.

## How to contribute

1. Fork the repo and open a pull request against `main`.
2. Edit only the files in `www/` (`index.html`, `styles.css`, `app.js`), then
   run `npx cap sync` — never edit the copied files under
   `android/app/src/main/assets/public/` or `ios/App/App/public/` directly.
3. Keep every die type on its own unique Cyberpunk 2077 color (see
   `AGENTS.md` for the mapping) and keep the two-column layout compact on a
   vertical phone screen.
4. Verify no external URLs were added: search `www/` for `http` / `https`
   after any change.
5. Say what you changed and why in the pull request. If you modified a roll,
   note that the change was tested.

## Contributor License Agreement (CLA)

David "MajteK" Alexander is the sole copyright holder of Ballin' Roller. This
agreement exists so the project can stay GPLv3 **and** stay publishable on
the app stores, where a GPLv3 project with outside co-copyright-holders
could run into trouble. It is a license agreement, not a copyright
assignment: **you keep the copyright in your own contributions.**

By submitting a pull request (or any other contribution) to Ballin' Roller, you
agree to the following:

1. **Your contribution is licensed under GPLv3.** You license your
   contribution under the GNU General Public License v3.0 or later, the
   same license as the rest of Ballin' Roller.
2. **You grant David "MajteK" Alexander a broad license to your
   contribution.** You grant him a perpetual, worldwide, non-exclusive,
   royalty-free, irrevocable license to use, reproduce, modify, distribute,
   publicly display, publicly perform, sublicense, and relicense your
   contribution (including under a different license, if a future version
   of the project ever needs it, e.g. for app-store distribution). This
   grant does not transfer your copyright — you remain a copyright holder
   of your own work and can use it however you like elsewhere.
3. **You have the right to contribute it.** Your contribution is your own
   original work (or you have the right to submit it), it does not infringe
   anyone else's copyright or other rights, and, if your employer has any
   claim on work you do, you have permission to submit it under these
   terms.
4. **No warranty.** You provide your contribution "as is", without warranty
   of any kind.

That is the whole agreement for now. If the project ever grows to the point
of needing a formal signed CLA, a CLA bot (e.g. CLA Assistant) will be added
to enforce signing before a pull request can merge; the terms above are what
it will ask you to sign.

### Signing (for the record)

If you would like your agreement on record, paste the following into your
first pull request:

> I, [your full name / GitHub username], agree to the Ballin' Roller Contributor
> License Agreement in CONTRIBUTING.md. I license my contributions under
> GPLv3 or later and grant David "MajteK" Alexander the license described
> in section 2 of that agreement.
>
> Signed: [name] — [date]

---

*This is not legal advice. The CLA above is a plain-language agreement
written for a small open-source project; if the project ever takes on
significant outside contributions, get a lawyer to review it.*
