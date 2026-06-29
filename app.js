import { createUniversalLink, getPlatform, redirectToStore } from './js/core/link-service.js';
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
};

function showNotification(message, variant = 'info') {
  elements.notification.textContent = message;
  elements.notification.dataset.variant = variant;
  elements.notification.hidden = false;
}

function renderCatalog() {
  const fragment = document.createDocumentFragment();

  APP_CATALOG.forEach((app) => {
    const universalLink = createUniversalLink(app.id);
    fragment.append(createAppCard({ app, universalLink, showNotification }));
  });

  elements.appList.replaceChildren(fragment);
  elements.appList.setAttribute('aria-busy', 'false');
}

function handleUniversalLink() {
  const requestedId = new URL(window.location.href).searchParams.get('app');
  if (!requestedId) return;

  const app = APP_CATALOG.find(({ id }) => id === requestedId);
  if (!app) {
    showNotification('That app link is not available. Choose an app below.', 'error');
    return;
  }

  const platform = getPlatform(navigator);
  if (platform === 'android' || platform === 'ios') {
    showNotification(`Opening ${app.name} in the correct app store…`);
    redirectToStore(app, platform);
    return;
  }

  const selectedCard = document.querySelector(`#app-${CSS.escape(app.id)}`);
  selectedCard?.classList.add('app-card--selected');
  selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showNotification(`Choose a store to download ${app.name}.`);
}

function bootstrap() {
  if (!elements.appList || !elements.notification) return;

  try {
    renderCatalog();
    handleUniversalLink();
  } catch (error) {
    console.error('Unable to initialize the app directory.', error);
    elements.appList.setAttribute('aria-busy', 'false');
    showNotification('Unable to load the app directory. Please refresh and try again.', 'error');
  }
}

bootstrap();
