import { takeEvery, call, select, put } from 'redux-saga/effects';
import constants from '../../actions/constants';
import { setAuthError } from '../../actions';
import { signInWithEmail} from '../../services/firebaseService';
import { getFormData } from '../../selectors';

function* sendLogin() {
  const credentials = yield select(getFormData);
  try {
    yield call(signInWithEmail({ ...credentials }))
  } catch (e) {
    yield put(setAuthError({ error: e.message }));
  }
}

function* loginSaga () {
  yield takeEvery(constants.SEND_FORM_DATA, sendLogin)
}

export default {
  run: loginSaga
};
