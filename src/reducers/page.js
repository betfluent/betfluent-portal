import constants from '../actions/constants';

export default (state = { formData: {}, pageData: {}, dialogOpen: false }, action) => {
  switch (action.type) {
    case constants.UPDATE_PAGE_DATA:
      return {
        ...state,
        pageData: {
          ...state.pageData,
          ...action.data
        }
      };
    case constants.UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.data
        }
      };
    case constants.IS_PAGE_LOADING:
      return {
        ...state,
        pageLoading: action.data
      };
    case constants.CLEAR_PAGE:
      return {
        formData: {},
        pageData: {},
        dialogOpen: false
      };
    case constants.OPEN_DIALOG:
      return {
        ...state,
        dialogOpen: true
      };
    case constants.CLOSE_DIALOG:
      return {
        ...state,
        dialogOpen: false
      };
    case constants.SET_PAGE_ERROR:
      return {
        ...state,
        pageError: action.data
      }
    default:
      return {
        ...state
      };
  }
};
