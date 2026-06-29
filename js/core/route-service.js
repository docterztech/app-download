const ROUTE_TYPES = Object.freeze({
  DIRECTORY: 'directory',
  APP_DETAIL: 'app-detail',
  NOT_FOUND: 'not-found',
});

export function getRouteState(catalog, currentUrl) {
  const requestedAppId = new URL(currentUrl).searchParams.get('app');

  if (!requestedAppId) {
    return Object.freeze({
      type: ROUTE_TYPES.DIRECTORY,
      apps: catalog,
      selectedApp: null,
      requestedAppId: null,
    });
  }

  const selectedApp = catalog.find(({ id }) => id === requestedAppId) ?? null;

  if (!selectedApp) {
    return Object.freeze({
      type: ROUTE_TYPES.NOT_FOUND,
      apps: catalog,
      selectedApp: null,
      requestedAppId,
    });
  }

  return Object.freeze({
    type: ROUTE_TYPES.APP_DETAIL,
    apps: [selectedApp],
    selectedApp,
    requestedAppId,
  });
}

export { ROUTE_TYPES };
