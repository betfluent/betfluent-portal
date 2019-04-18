import {
  firebaseRef,
  firebaseOrder,
  getFeed
} from '../services/firebaseService';

export default {
  getAllManagersFeed: (callback) => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'managers'
      },
      callback
    });
  },
  getAllPublicUsersFeed: callback => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'public/users'
      },
      list: true,
      callback
    });
  },
  getAllUserIdentitiesFeed: callback => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'userIdentities'
      },
      callback
    })
  },
  getAllUsersFeed: (callback) => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'users'
      },
      callback
    });
  },
  getAllGamesFeed: (league, callback) => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: `${league.toLowerCase()}/games`
      },
      callback
    });
  },
  getAllPoolsFeed: callback => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'funds'
      },
      callback
    })
  },
  getAllUserDeposits: callback => {
    return getFeed({
      ref: firebaseOrder,
      params: {
        ref: 'interactions',
        child: 'type',
        value: 'Deposit'
      },
      list: true,
      callback
    });
  },
  getAllUserWagers: callback => {
    return getFeed({
      ref: firebaseOrder,
      params: {
        ref: 'interactions',
        child: 'type',
        value: 'Wager'
      },
      list: true,
      callback
    });
  },
  getUserInteractionsFeed: (userId, callback) => {
    return getFeed({
      ref: firebaseOrder,
      params: {
        ref: 'interactions',
        child: 'userId',
        value: userId
      },
      list: true,
      callback
    });
  },
  getAllBetsFeed: (callback) => {
    return getFeed({
      ref: firebaseRef,
      params: {
        ref: 'wagers'
      },
      callback
    });
  }
};
