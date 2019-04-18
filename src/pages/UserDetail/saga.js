import { takeEvery, call, select, put } from 'redux-saga/effects';
import constants from '../../actions/constants';
import { setPageError, closeDialog } from '../../actions';
import fetchService from '../../services/fetchService';
import endpointMapper from '../../config/endpointMapper';

function* sendFormData() {
  const state = yield select();

  const { formData, pageData: { id } } = state.page;
  const { users } = state.app.appData;
  const { name } = users[id];

  const body = {
    ...formData,
    name,
    userId: id
  }

  try {
    const success = yield call(fetchService, { endpoint: endpointMapper.makeManager, body });
    if (!!success) yield put(closeDialog());
  } catch (e) {
    yield put(setPageError({ error: e.message }));
  }
}

function* pageSaga () {
  yield takeEvery(constants.SEND_FORM_DATA, sendFormData)
}

export default {
  run: pageSaga
};
