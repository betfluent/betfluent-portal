import { eventChannel } from 'redux-saga';
import { put, call, take, fork } from 'redux-saga/effects';
import { setAuthUser, setAuthError, clearAppData } from '../actions';
import { firebaseAuth, signOut } from '../services/firebaseService';
import app from './app';

const b64DecodeUnicode = (str) => {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}


const authStateWatch = () => {
  return eventChannel(emitter => {
    const authState = firebaseAuth.onAuthStateChanged(auth => {
      emitter(auth || false);
    });
    return authState;
  });
};

export default function* getAuthUser() {
  try {
    const authState = yield call(authStateWatch);
    while (true) {
      const auth = yield take(authState);
      if (auth) {
        const idToken = yield call(() => auth.getIdToken());
        const userToken = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]));
        if (userToken.admin || userToken.operator) {
          yield put(setAuthUser(auth));
          yield fork(app.loadSaga);
        } else {
          const error = 'You do not have permissions to access this portal'
          yield put(setAuthError({ error }));
          signOut();
        }
      } else {
        yield put(setAuthUser(false));
        yield fork(app.close);
        yield put(clearAppData());
      }
    }
  } catch (e) {
    console.error('firebase error', e);
  }
}
