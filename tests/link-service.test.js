import test from 'node:test';
import assert from 'node:assert/strict';

import { createUniversalLink, getPlatform, redirectToStore } from '../js/core/link-service.js';

test('creates a clean universal link for an app', () => {
  global.window = {
    location: {
      href: 'https://docterztech.github.io/app-download/?old=value#section',
    },
  };

  assert.equal(
    createUniversalLink('cuddlesncare'),
    'https://docterztech.github.io/app-download/?app=cuddlesncare',
  );
});

test('detects Android devices', () => {
  assert.equal(
    getPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 15)', platform: 'Linux', maxTouchPoints: 5 }),
    'android',
  );
});

test('detects iPhone and modern iPadOS devices', () => {
  assert.equal(
    getPlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)', platform: 'iPhone', maxTouchPoints: 5 }),
    'ios',
  );
  assert.equal(
    getPlatform({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 5 }),
    'ios',
  );
});

test('treats desktop browsers as other', () => {
  assert.equal(
    getPlatform({ userAgent: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', maxTouchPoints: 0 }),
    'other',
  );
});

test('redirects each mobile platform to the correct store', () => {
  const app = {
    playStoreUrl: 'https://play.google.com/example',
    appStoreUrl: 'https://apps.apple.com/example',
  };
  const redirects = [];
  global.window = { location: { replace: (url) => redirects.push(url) } };

  redirectToStore(app, 'android');
  redirectToStore(app, 'ios');

  assert.deepEqual(redirects, [app.playStoreUrl, app.appStoreUrl]);
});
