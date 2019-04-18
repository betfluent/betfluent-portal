import constants from '../actions/constants';

export default (state = {}, action) => {
  switch (action.type) {
    case constants.RECEIVE_AUTH_USER:
      return {
        ...state,
        auth: action.data
      };
    case constants.RECEIVE_AUTH_ERROR:
      return {
        ...state,
        ...action.data
      }
    default:
      return {
        ...state
      };
  }
};
