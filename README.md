# Docterz App Downloads

Production-ready GitHub Pages directory for sharing one link and one QR code per mobile app.

## How it works

- The home page lists every configured app, its universal link, QR code, and direct store links.
- A URL such as `https://docterztech.github.io/app-download/?app=cuddlesncare` is the single shareable link.
- Android devices are redirected to Google Play.
- iPhone and iPad devices are redirected to the App Store.
- Desktop users see the selected app and can choose a store.
- QR codes are generated in the browser by the vendored QRCode.js library. No third-party API receives the links.

## Add or update an app

Edit `APP_CATALOG` in `app.js`:

```js
{
  id: 'unique-url-safe-id',
  name: 'Display name',
  initials: 'DN',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=...',
  appStoreUrl: 'https://apps.apple.com/...',
}
```

The universal link and QR code are created automatically from the app `id`.

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
