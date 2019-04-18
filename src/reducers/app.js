import constants from '../actions/constants';

export default (state = {appData: {}}, action) => {
  switch (action.type) {
    case constants.LOAD_APP_DATA:
      return {
        ...state,
        appData: {
          ...state.appData,
          ...action.data
        }
      };
    case constants.IS_APP_LOADING:
      return {
        ...state,
        appLoading: action.data
      }
    case constants.CLEAR_APP_DATA:
      return {
        appData: {}
      };
    default:
      return {
        ...state
      };
  }
};
