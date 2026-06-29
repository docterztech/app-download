const QR_SIZE = 184;

const STORE_ICONS = Object.freeze({
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.6v16.8L19 12 5 3.6Z"></path></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 12.8c0-2.4 2-3.6 2.1-3.7a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.8a4.9 4.9 0 0 0-4.1 2.5c-1.8 3-.5 7.5 1.2 10 .9 1.2 1.8 2.5 3.2 2.4 1.3-.1 1.8-.8 3.4-.8 1.5 0 2 .8 3.4.8s2.3-1.2 3.1-2.4a10.7 10.7 0 0 0 1.4-2.9 4.2 4.2 0 0 1-3.2-4.1ZM14.4 5.7A4.2 4.2 0 0 0 15.4 2a4.3 4.3 0 0 0-2.9 1.4 4 4 0 0 0-1 3.5 3.6 3.6 0 0 0 2.9-1.2Z"></path></svg>',
});

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createStoreLink({ href, label, icon }) {
  const link = createElement('a', 'store-link');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Download from ${label}`);
  link.innerHTML = `${STORE_ICONS[icon]}<span><small>Download on the</small>${label}</span><svg class="store-link__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"></path></svg>`;
  return link;
}

async function copyText(value, fallbackInput) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Continue to the selection-based fallback when clipboard permission is denied.
    }
  }

  fallbackInput.select();
  fallbackInput.setSelectionRange(0, value.length);
  const copied = document.execCommand('copy');
  return copied;
}

function createLinkField(universalLink, appName, showNotification) {
  const wrapper = createElement('div', 'link-field');
  const value = createElement('input', 'link-field__value');
  value.type = 'url';
  value.value = universalLink;
  value.readOnly = true;
  value.spellcheck = false;
  value.setAttribute('aria-label', `Universal download link for ${appName}`);

  const button = createElement('button', 'copy-button', 'Copy link');
  button.type = 'button';
  button.addEventListener('click', async () => {
    try {
      const copied = await copyText(universalLink, value);
      button.textContent = copied ? 'Copied' : 'Selected';
      button.dataset.copied = copied ? 'true' : 'selected';
      showNotification(
        copied ? `${appName} link copied.` : 'Link selected. Press Ctrl+C or Command+C to copy.',
        copied ? 'success' : 'info',
      );
      window.setTimeout(() => {
        button.textContent = 'Copy link';
        delete button.dataset.copied;
      }, 2000);
    } catch (error) {
      console.error('Unable to copy the universal link.', error);
      showNotification('Unable to select the link. Select and copy it manually.', 'error');
      value.focus();
    }
  });

  wrapper.append(value, button);
  return wrapper;
}

function renderQrCode(container, universalLink, appName) {
  if (typeof window.QRCode !== 'function') {
    throw new Error('QRCode library is unavailable.');
  }

  container.setAttribute('aria-label', `QR code for ${appName}: ${universalLink}`);
  new window.QRCode(container, {
    text: universalLink,
    width: QR_SIZE,
    height: QR_SIZE,
    colorDark: '#071234',
    colorLight: '#ffffff',
    correctLevel: window.QRCode.CorrectLevel.M,
  });
}

export function createAppCard({ app, universalLink, showNotification }) {
  const article = createElement('article', 'app-card');
  article.id = `app-${app.id}`;

  const header = createElement('header', 'app-card__header');
  const icon = createElement('div', 'app-icon', app.initials);
  icon.setAttribute('aria-hidden', 'true');
  const title = createElement('h3', 'app-card__title', app.name);
  header.append(icon, title);

  const linkSection = createElement('div', 'app-card__link');
  linkSection.append(
    createElement('p', 'field-label', 'Universal link'),
    createLinkField(universalLink, app.name, showNotification),
  );

  const downloadSection = createElement('div', 'download-options');
  const qrColumn = createElement('div', 'download-options__qr');
  qrColumn.append(createElement('p', 'field-label', 'Scan to download'));
  const qrFrame = createElement('div', 'qr-frame');
  qrFrame.setAttribute('role', 'img');
  qrColumn.append(qrFrame);

  const storesColumn = createElement('div', 'download-options__stores');
  storesColumn.append(
    createElement('p', 'field-label', 'Or download from'),
    createStoreLink({ href: app.playStoreUrl, label: 'Google Play', icon: 'play' }),
    createStoreLink({ href: app.appStoreUrl, label: 'App Store', icon: 'apple' }),
  );

  downloadSection.append(qrColumn, storesColumn);
  article.append(header, linkSection, downloadSection);
  renderQrCode(qrFrame, universalLink, app.name);
  return article;
}
