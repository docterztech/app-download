const MOBILE_PLATFORMS = Object.freeze({
  ANDROID: 'android',
  IOS: 'ios',
  OTHER: 'other',
});

export function createUniversalLink(appId) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('app', appId);
  return url.toString();
}

export function getPlatform(navigatorObject) {
  const userAgent = navigatorObject.userAgent ?? '';
  const isIPadOS = navigatorObject.platform === 'MacIntel' && navigatorObject.maxTouchPoints > 1;

  if (/android/i.test(userAgent)) return MOBILE_PLATFORMS.ANDROID;
  if (/iPad|iPhone|iPod/i.test(userAgent) || isIPadOS) return MOBILE_PLATFORMS.IOS;
  return MOBILE_PLATFORMS.OTHER;
}

export function redirectToStore(app, platform) {
  const storeUrl = platform === MOBILE_PLATFORMS.ANDROID
    ? app.playStoreUrl
    : app.appStoreUrl;

  window.location.replace(storeUrl);
}
