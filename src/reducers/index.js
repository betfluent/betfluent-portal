import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import app from './app';
import auth from './auth';
import page from './page';

export default history =>
  combineReducers({
    router: connectRouter(history),
    app,
    auth,
    page
  });
