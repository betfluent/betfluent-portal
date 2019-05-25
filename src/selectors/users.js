import { createSelector } from 'reselect';
import moment from 'moment';
import { getAppData, isAppLoading, getPageData } from './index';

export const getUserData = createSelector(
  getAppData,
  isAppLoading,
  (appData,appLoading) => {
    if (appLoading) return false;
    const { users = {}, userIdentities = {}, deposits = [] } = appData;
    const userData = Object.keys(users).map(k => users[k]).map(u => {
      const user = { ...u };
      const userIdentity = Object.keys(userIdentities).map(k => userIdentities[k]).find(u => u.userId === user.id) || {};
      user.first = userIdentity.firstName;
      user.last = { last: userIdentity.lastName, id: user.id };
      user.address = `${userIdentity.address1} ${userIdentity.address2} ${userIdentity.addressCity}, ${userIdentity.addressState} ${userIdentity.addressPostalCode}`;
      user.dob = userIdentity.dateOfBirth;
      user.email = userIdentity.emailAddress;
      user.contribution = (user.investments && Object.keys(user.investments).map(k => user.investments[k]).reduce((sum, item) => sum + item / 100, 0)) || 0;
      user.winPct = (user.returns && (Object.keys(user.investments).map(k => user.returns[k] - user.investments[k]).filter(value => value > 0).length / Object.keys(user.returns).length)* 100) || 0;
      user.realBalance = user.balance / 100;
      user.totalDeposits = deposits.filter(d => d.userId === user.id).reduce((sum, item) => sum + item.amount, 0) / 100;
      user.isManager = !!user.managerId;
      user.date = moment(user.joinDate).format('MM/DD/YYYY [@] hh:mm a');
      return user;
    });
    return userData;
  }
);

export const getUserDetail = createSelector(
  getAppData,
  isAppLoading,
  getPageData,
  (appData,appLoading, pageData) => {
    if (appLoading) return false;
    const { users = {}, userIdentities = {}, deposits = [], pools = {}, managers = {}, wagers = [] } = appData;
    const { id } = pageData;
    const user = Object.keys(users).map(k => users[k]).find(u => u.id === id) || {};
    const userIdentity = Object.keys(userIdentities).map(k => userIdentities[k]).find(u => u.userId === user.id) || {};
    user.first = userIdentity.firstName;
    user.last = { last: userIdentity.lastName, id: user.id };
    user.address = `${userIdentity.address1} ${userIdentity.address2} ${userIdentity.addressCity}, ${userIdentity.addressState} ${userIdentity.addressPostalCode}`;
    user.dob = userIdentity.dateOfBirth;
    user.email = userIdentity.emailAddress;
    user.contribution = (user.investments && Object.keys(user.investments).map(k => user.investments[k]).reduce((sum, item) => sum + item / 100, 0)) || 0;
    user.winPct = (user.returns && (Object.keys(user.investments).map(k => user.returns[k] - user.investments[k]).filter(value => value > 0).length / Object.keys(user.returns).length)* 100) || 0;
    user.totalDeposits = deposits.filter(d => d.userId === user.id).reduce((sum, item) => sum + item.amount, 0) / 100;
    const userPools = Object.keys(pools).map(k => pools[k]).filter(p => user.investments && Object.keys(user.investments).includes(p.id));
    user.realBalance = user.balance / 100;
    user.pools = userPools.map(p => {
      const pool = { ...p };
      const timeOfWager = wagers.sort((a, b) => b.time - a.time).find(w => {
        return w.userId === user.publicId && w.fundId === pool.id;
      });
      if (timeOfWager) pool.timeOfWager = moment(timeOfWager.time).format('MM/DD/YYYY [@] hh:mm a');
      pool.managerName = managers[pool.managerId].name;
      pool.userWagered = user.investments[pool.id] / 100;
      return pool;
    });
    return user;
  }
);
