import { createUniversalLink, getPlatform, redirectToStore } from './js/core/link-service.js';
import { getRouteState, ROUTE_TYPES } from './js/core/route-service.js';
import { createAppCard } from './js/ui/app-card.js';

// Single source of truth for every app shown on the page.
const APP_CATALOG = Object.freeze([
  Object.freeze({
    id: 'cuddlesncare',
    name: 'CuddlesNCare',
    initials: 'CC',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.docterz.connect.cuddles.care',
    appStoreUrl: 'https://apps.apple.com/in/app/cuddlesncare-online/id1552884476',
  }),
  Object.freeze({
    id: 'fortitudebydrashvinchouhan',
    name: 'Fortitude by Dr. Ashvin Chouhan',
    initials: 'FA',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.docterz.connect.fortitudebydrashvinchouhan',
    appStoreUrl: 'https://apps.apple.com/in/app/fortitude-by-dr-ashvin-chouhan/id6560111718',
  }),
]);

const elements = {
  appList: document.querySelector('#app-list'),
  notification: document.querySelector('#notification'),
  pageTitle: document.querySelector('#page-title'),
  pageSubtitle: document.querySelector('#page-subtitle'),
};

function showNotification(message, variant = 'info') {
  elements.notification.textContent = message;
  elements.notification.dataset.variant = variant;
  elements.notification.hidden = false;
}

function updatePageCopy(routeState) {
  if (!elements.pageTitle || !elements.pageSubtitle) return;

  if (routeState.type === ROUTE_TYPES.APP_DETAIL) {
    elements.pageTitle.textContent = `Download ${routeState.selectedApp.name}`;
    elements.pageSubtitle.textContent = 'Scan the QR code or open the right store for your device.';
    document.title = `${routeState.selectedApp.name} Download | Docterz Apps`;
    return;
  }

  elements.pageTitle.textContent = 'Download the right app for your device';
  elements.pageSubtitle.textContent = 'Scan once or share one link. We’ll open the correct store automatically.';
  document.title = 'Docterz Apps';
}

function renderApps(apps, viewMode = 'directory') {
  const fragment = document.createDocumentFragment();

  apps.forEach((app) => {
    const universalLink = createUniversalLink(app.id);
    fragment.append(createAppCard({ app, universalLink, showNotification }));
  });

  elements.appList.replaceChildren(fragment);
  elements.appList.dataset.view = viewMode;
  elements.appList.setAttribute('aria-busy', 'false');
}

function handleRouteState(routeState) {
  if (routeState.type === ROUTE_TYPES.NOT_FOUND) {
    showNotification('That app link is not available. Choose an app below.', 'error');
    return;
  }

  if (routeState.type !== ROUTE_TYPES.APP_DETAIL) return;

  const app = routeState.selectedApp;
  const platform = getPlatform(navigator);
  if (platform === 'android' || platform === 'ios') {
    showNotification(`Opening ${app.name} in the correct app store…`);
    redirectToStore(app, platform);
    return;
  }

  const selectedCard = document.querySelector(`#app-${CSS.escape(app.id)}`);
  selectedCard?.classList.add('app-card--selected');
  showNotification(`Choose a store to download ${app.name}.`);
}

function bootstrap() {
  if (!elements.appList || !elements.notification) return;

  try {
    const routeState = getRouteState(APP_CATALOG, window.location.href);
    updatePageCopy(routeState);
    renderApps(
      routeState.apps,
      routeState.type === ROUTE_TYPES.APP_DETAIL ? 'single' : 'directory',
    );
    handleRouteState(routeState);
  } catch (error) {
    console.error('Unable to initialize the app directory.', error);
    elements.appList.setAttribute('aria-busy', 'false');
    showNotification('Unable to load the app directory. Please refresh and try again.', 'error');
  }
}

bootstrap();
