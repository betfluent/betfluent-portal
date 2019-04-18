import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';
import pages from '../pages';

export const isAuth = state => (state.auth && state.auth.auth);
export const getAuthError = state => (state.auth && state.auth.error) || '';
export const getAppData = state => (state.app && state.app.appData) || {};
export const isAppLoading = state => state.app && state.app.appLoading;
export const getFormData = state => (state.page && state.page.formData) || {};
export const getPageData = state => (state.page && state.page.pageData) || {};
export const isPageLoading = state => state.page && state.page.pageLoading;
export const getLocation = state =>
  state.router && state.router.location && state.router.location.pathname;

export const getPage = createSelector(getLocation, location => {
  if (location) {
    const page = pages.find(
      p =>
        p.route.path !== '*' &&
        new RegExp(`^${p.route.path.replace(/:\w+/, '.*?')}$`).test(location)
    );
    const matched = matchPath(location, { path: page && page.route.path });
    let params = {};
    /* eslint-disable-next-line */
    if (matched && matched.params) params = matched.params;
    return { page, params };
  }
  return {};
});

export const getGlobalStats = createSelector(
  getAppData,
  appData => {
    const { users = {}, managers = {}, deposits = [], wagers = [] } = appData;
    return {
      users: Object.keys(users).length - Object.keys(managers).length,
      managers: Object.keys(managers).length,
      deposits: deposits.reduce((sum, d) => sum + d.amount / 100, 0),
      wagers: wagers.reduce((sum, w) => sum + w.amount / 100, 0)
    }
  }
)
