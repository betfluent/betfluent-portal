import { eventChannel } from 'redux-saga';
import { take, put, call, select, fork, cancel } from 'redux-saga/effects';
import { loadAppData, appLoading } from '../actions';
import { getAppData } from '../selectors';
import f from '../config/firebase';

let channels = [];
let betSaga;
let poolSaga;
let managerSaga;
let userSaga;
let userIdentitiesSaga;
let userWagersSaga;
let userDepositsSaga;
let gamesSaga = [];

const getChannel = (channel, params) => {
  const chan = eventChannel(emit => {
    const channelFeed = params
      ? f[channel](params, data => {
          emit(data);
        })
      : f[channel](data => {
          emit(data);
        });
    return channelFeed.off;
  });
  channels.push(chan);
  return chan;
};

const getUnique = (arr, key) => {
  const itemArry = Object.keys(arr).map(k => arr[k]).map(item => item[key]);
  const itemObj = itemArry.reduce((obj, item) => {
    return {
      ...obj,
      [item]: true
    };
  }, {});
  return Object.keys(itemObj);
}

function* getAllGames(league, done) {
  try {
    const gamesData = yield call(getChannel, 'getAllGamesFeed', league);
    while (true) {
      const games = yield take(gamesData);
      yield put(
        loadAppData({
          [league]: games
        })
      );
      if (done) yield put(appLoading(false));
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* getAllUserWagers() {
  try {
    const userWagers = yield call(getChannel, 'getAllUserWagers');
    while (true) {
      const wagers = yield take(userWagers);
      yield put(
        loadAppData({
          wagers
        })
      );
    }
  } catch (e) {
    console.error('firebase error: ', e);
  }
}

function* getAllUserDeposits() {
  try {
    const userDeposits = yield call(getChannel, 'getAllUserDeposits');
    while (true) {
      const deposits = yield take(userDeposits);
      yield put(
        loadAppData({
          deposits
        })
      );
    }
  } catch (e) {
    console.error('firebase error: ', e);
  }
}

function* getAllUserIdentities() {
  try {
    const usersData = yield call(getChannel, 'getAllUserIdentitiesFeed');
    while (true) {
      const userIdentities = yield take(usersData);
      yield put(
        loadAppData({
          userIdentities
        })
      );
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* getAllUsers() {
  try {
    const usersData = yield call(getChannel, 'getAllUsersFeed');
    while (true) {
      const users = yield take(usersData);
      yield put(
        loadAppData({
          users
        })
      );
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* getAllPools() {
  try {
    const poolsData = yield call(getChannel, 'getAllPoolsFeed');
    while (true) {
      const pools = yield take(poolsData);
      yield put(
        loadAppData({
          pools
        })
      );
      if (!pools.length) yield put(appLoading(false));
      const leagues = getUnique(pools, 'league');
      const keys = Object.keys(yield select(getAppData));
      const newLeagues = leagues.filter(l => !keys.includes(l));
      for (let i = 0; i < newLeagues.length; i++) {
        const saga = yield fork(getAllGames, newLeagues[i], i === newLeagues.length - 1);
        gamesSaga.push(saga);
      }
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* getAllManagers() {
  try {
    const managersData = yield call(getChannel, 'getAllManagersFeed');
    while (true) {
      const managers = yield take(managersData);
      yield put(
        loadAppData({
          managers
        })
      );
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* getAllBets() {
  try {
    const betsData = yield call(getChannel, 'getAllBetsFeed');
    while (true) {
      const bets = yield take(betsData);
      yield put(loadAppData({ bets }));
    }
  } catch (e) {
    console.error('firebase error:', e);
  }
}

function* loadSaga() {
  yield put(appLoading(true));
  betSaga = yield fork(getAllBets);
  poolSaga = yield fork(getAllPools);
  managerSaga = yield fork(getAllManagers);
  userSaga = yield fork(getAllUsers);
  userIdentitiesSaga = yield fork(getAllUserIdentities);
  userWagersSaga = yield fork(getAllUserWagers);
  userDepositsSaga = yield fork(getAllUserDeposits);
}

function* close() {
  channels.map(c => c.close());
  channels = [];
  yield cancel(betSaga);
  yield cancel(poolSaga);
  yield cancel(managerSaga);
  yield cancel(userSaga);
  yield cancel(userIdentitiesSaga);
  yield cancel(userWagersSaga);
  yield cancel(userDepositsSaga);
  for (let i = 0; i < gamesSaga.length; i++) {
    yield cancel(gamesSaga[i]);
  }
  gamesSaga = [];
}

export default {
  loadSaga,
  close
}
