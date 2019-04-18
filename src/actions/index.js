import constants from './constants';

export const loadAppData = data => ({
  type: constants.LOAD_APP_DATA,
  data
});

export const clearAppData = () => ({
  type: constants.CLEAR_APP_DATA
});

export const appLoading = data => ({
  type: constants.IS_APP_LOADING,
  data
});

export const updatePageData = data => ({
  type: constants.UPDATE_PAGE_DATA,
  data
});

export const clearPage = () => ({
  type: constants.CLEAR_PAGE
});

export const updateFormData = data => ({
  type: constants.UPDATE_FORM_DATA,
  data
});

export const sendFormData = () => ({
  type: constants.SEND_FORM_DATA
});

export const setAuthUser = data => ({
  type: constants.RECEIVE_AUTH_USER,
  data
});

export const setAuthError = data => ({
  type: constants.RECEIVE_AUTH_ERROR,
  data
});

export const pageLoading = data => ({
  type: constants.IS_PAGE_LOADING,
  data
});

export const setPageError = data => ({
  type: constants.SET_PAGE_ERROR,
  data
})

export const openDialog = () => ({
  type: constants.OPEN_DIALOG
});

export const closeDialog = () => ({
  type: constants.CLOSE_DIALOG
});
