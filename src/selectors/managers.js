import { createSelector } from 'reselect';
import moment from 'moment';
import { getAppData, isAppLoading, getPageData } from './index';

export const getManagerData = createSelector(
  getAppData,
  isAppLoading,
  (appData,appLoading) => {
    if (appLoading) return false;
    const { pools = {}, managers = {}, bets = {} } = appData;
    const managerData = Object.keys(managers).map(k => managers[k]).map(m => {
      const manager = { ...m };
      const managerPools = Object.keys(pools).map(k => pools[k]).filter(p => p.managerId === manager.id && !p.isTraining);
      const managerBets = Object.keys(bets).map(k => bets[k]).filter(b => b.managerId === manager.id && !b.fade);

      manager.name = { name: manager.name, id: manager.id };

      manager.amountRaised = managerPools.reduce((sum, pool) => {
        return sum + ((pool.amountWagered + pool.fadeAmountWagered) / 100);
      }, 0);

      manager.poolsCreated = managerPools.reduce((sum) => {
        return sum + 1
      }, 0);

      manager.averagePoolSize = managerPools.reduce((sum, pool) => {
        return sum + (pool.playerCount || 0) + (pool.fadePlayerCount || 0);
      }, 0) / (manager.poolsCreated || 1);

      manager.totalEarnings = managerPools.reduce((sum, pool) => {
        return sum + (pool.status === 'RETURNED'
          ? ((
              (pool.amountReturned > pool.amountWagered ? pool.amountReturned - pool.amountWagered : 0) +
              (pool.fadeReturned > pool.fadeAmountWagered ? pool.fadeReturned - pool.fadeAmountWagered : 0)
            ) / 100) * (pool.percentFee / 100) * (pool.pctOfFeeCommission / 100)
          : 0)
      }, 0);
      manager.totalWins = managerBets.reduce((sum, bet) => {
        return bet.status === 'RETURNED' && bet.returned > 0 ? sum + 1 : sum
      }, 0);

      manager.totalLosses = managerBets.reduce((sum, bet) => {
        return bet.status === 'RETURNED' && bet.returned === 0 ? sum + 1 : sum
      }, 0);

      manager.winPct = (manager.totalWins / (manager.totalWins + manager.totalLosses)) * 100 || 0;

      const lastPoolCreated = managerPools.sort((a, b) => b.createdTimeMillis - a.createdTimeMillis)[0] || {};

      manager.lastPoolCreated = moment(lastPoolCreated.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');

      return manager;
    });
    return managerData;
  }
);

export const getManagerDetail = createSelector(
  getAppData,
  isAppLoading,
  getPageData,
  (appData, appLoading, pageData) => {
    if (appLoading) return false;
    const { pools = {}, managers = {}, bets = {}, users = {}, userIdentities = {} } = appData;
    const { id } = pageData;
    const manager = { ...managers[id] }
    const user = Object.keys(users).map(k => users[k]).find(u => u.managerId === id) || {};
    const userIdentity = Object.keys(userIdentities).map(k => userIdentities[k]).find(u => u.userId === user.id) || {};
    if (manager) {
      const poolsArr = Object.keys(pools).map(k => pools[k]).filter(p => id === p.managerId);
      manager.poolsArr = poolsArr.map(p => {
        const wagersArr = (p.wagers && Object.keys(p.wagers).map(w => bets[w] || {})) || [];
        p.wagersArr = wagersArr.map(w => {
          const game = (appData[w.gameLeague] && appData[w.gameLeague][w.gameId]) || {};
          w.createdTime = moment(w.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
          w.gameTime = moment(w.scheduledTimeUnix).format('MM/DD/YYYY [@] hh:mm a');
          w.gameName = game.description !== ' vs ' ? game.description : `${game.awayTeamName} vs ${game.homeTeamName}`;
          w.details = `${w.points || ''} ${w.selection || w.overUnder}`;
          w.amountWagered = w.wagered / 100;
          w.score = `${game.awayTeamScore} - ${game.homeTeamScore}`;
          w.winloss = (w.status === 'RETURNED' && (w.returned > 0 ? 'Win' : 'Loss')) || 'N/A';
          return w;
        });
        p.createdTime = moment(p.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
        p.closeTime = moment(p.closingTime * 1000).format('MM/DD/YYYY [@] hh:mm a');
        p.returnTime = moment(p.returnTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
        p.wagered = p.amountWagered / 100;
        return p;
      });
      manager.email = userIdentity.emailAddress;
    }
    return manager || {};
  }
);
