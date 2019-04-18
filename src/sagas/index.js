import { takeEvery, select, put, fork, cancel, call } from 'redux-saga/effects';
import { clearPage, updatePageData } from '../actions';
import constants from '../actions/constants';
import { getPage } from '../selectors';
import appAuth from './user';

let runningChannel;
let runningSaga;

function* onLocationChange() {
  if (runningChannel) yield call(runningChannel);
  if (runningSaga) yield cancel(runningSaga);
  yield put(clearPage());
  const { page, params } = yield select(getPage);
  if (params && params.id) yield put(updatePageData({ id: params.id }));
  if (page && typeof page.loadSaga === 'object') {
    runningChannel = page.loadSaga && page.loadSaga.close;
    runningSaga = yield fork(page.loadSaga.run, params);
  }
}

function* rootSaga() {
  yield fork(appAuth);
  yield takeEvery(constants.LOCATION_CHANGE, onLocationChange);
}

export default rootSaga;
