import test from 'node:test';
import assert from 'node:assert/strict';

import { createUniversalLink, getPlatform, redirectToStore } from '../js/core/link-service.js';
import { getRouteState, ROUTE_TYPES } from '../js/core/route-service.js';

const testCatalog = Object.freeze([
  Object.freeze({ id: 'cuddlesncare', name: 'CuddlesNCare' }),
  Object.freeze({ id: 'fortitudebydrashvinchouhan', name: 'Fortitude by Dr. Ashvin Chouhan' }),
]);

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

test('uses the full directory when no app is requested', () => {
  const state = getRouteState(testCatalog, 'https://docterztech.github.io/app-download/');

  assert.equal(state.type, ROUTE_TYPES.DIRECTORY);
  assert.equal(state.apps.length, 2);
  assert.equal(state.selectedApp, null);
});

test('uses a single app detail route for valid app links', () => {
  const state = getRouteState(
    testCatalog,
    'https://docterztech.github.io/app-download/?app=cuddlesncare',
  );

  assert.equal(state.type, ROUTE_TYPES.APP_DETAIL);
  assert.equal(state.apps.length, 1);
  assert.equal(state.apps[0].id, 'cuddlesncare');
  assert.equal(state.selectedApp.name, 'CuddlesNCare');
});

test('falls back to the directory for invalid app links', () => {
  const state = getRouteState(testCatalog, 'https://docterztech.github.io/app-download/?app=missing');

  assert.equal(state.type, ROUTE_TYPES.NOT_FOUND);
  assert.equal(state.apps.length, 2);
  assert.equal(state.selectedApp, null);
});
