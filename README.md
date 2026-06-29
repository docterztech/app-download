# Docterz App Downloads

Production-ready GitHub Pages directory for sharing one link and one QR code per mobile app.

## How it works

- The home page lists every configured app, its universal link, QR code, and direct store links.
- A URL such as `https://docterztech.github.io/app-download/?app=cuddlesncare` is the single shareable link.
- Android devices are redirected to Google Play.
- iPhone and iPad devices are redirected to the App Store.
- Desktop users see the selected app and can choose a store.
- QR codes are generated in the browser by the vendored QRCode.js library. No third-party API receives the links.

## How to add new apps

All app data lives in one place: `APP_CATALOG` inside `app.js`.

To add a new app, add one new object to the `APP_CATALOG` array:

```js
Object.freeze({
  id: 'yourappname',
  name: 'Your App Name',
  initials: 'YA',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=your.android.package',
  appStoreUrl: 'https://apps.apple.com/in/app/your-app-name/id1234567890',
}),
```

Example:

```js
const APP_CATALOG = Object.freeze([
  Object.freeze({
    id: 'cuddlesncare',
    name: 'CuddlesNCare',
    initials: 'CC',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.docterz.connect.cuddles.care',
    appStoreUrl: 'https://apps.apple.com/in/app/cuddlesncare-online/id1552884476',
  }),

  Object.freeze({
    id: 'yourappname',
    name: 'Your App Name',
    initials: 'YA',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=your.android.package',
    appStoreUrl: 'https://apps.apple.com/in/app/your-app-name/id1234567890',
  }),
]);
```

Field rules:

- `id` must be unique and URL-safe. Use lowercase text with no spaces, for example `myclinicapp`.
- `name` is the display name shown on the website.
- `initials` appears inside the app icon box.
- `playStoreUrl` is the Android Google Play link.
- `appStoreUrl` is the iPhone/iPad App Store link.

After adding an app, run:

```bash
npm test
git add app.js
git commit -m "Add Your App Name"
git push origin main
```

GitHub Pages deploys automatically after the push.

The new public app link will be:

```text
https://docterztech.github.io/app-download/?app=yourappname
```

The QR code is generated automatically from that link.

## GitHub Pages

In the repository settings, configure Pages to deploy from the `main` branch and `/ (root)` folder.

## Test

Run `npm test` to validate universal-link generation and platform routing.

## Architecture

- `app.js` — immutable app catalog and application bootstrap
- `js/core/link-service.js` — universal-link creation and platform routing
- `js/ui/app-card.js` — accessible app-card, QR, copy, and store-link UI
- `styles.css` — responsive design system and component styles
- `vendor/qrcodejs/` — locally hosted MIT-licensed QR generator
