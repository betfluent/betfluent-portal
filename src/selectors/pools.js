import { createSelector } from 'reselect';
import moment from 'moment';
import { getAppData, isAppLoading, getPageData } from './index';

export const getPoolData = createSelector(
  getAppData,
  isAppLoading,
  (appData,appLoading) => {
    if (appLoading) return false;
    const { pools = {}, managers = {} } = appData;
    const poolData = Object.keys(pools).map(k => pools[k]).map(p => {
      const pool = { ...p };
      const manager = managers[pool.managerId] || {};
      pool.name = { name: pool.name, id: pool.id }; 
      pool.managerName = manager.name;
      pool.wagered = (pool.amountWagered + (pool.fadeAmountWagered || 0)) / 100;
      pool.createdTime = moment(pool.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.closeTime = moment(pool.closingTime * 1000).format('MM/DD/YYYY [@] hh:mm a');
      pool.returnTime = moment(pool.returnTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.betCount = (pool.wagers && Object.keys(pool.wagers).length) || 0;
      return pool;
    });
    return poolData.filter(b => !b.isTraining);
  }
);


export const getPoolDetail = createSelector(
  getAppData,
  isAppLoading,
  getPageData,
  (appData, appLoading, pageData) => {
    if (appLoading) return false;
    const { bets = {}, pools = {}, managers = {}, users = {}, userIdentities = {}, wagers = [] } = appData;
    const { id } = pageData;
    const pool = { ...pools[id] }
    const manager = managers[pool.managerId];
    if (pool) {
      pool.managerName = manager && manager.name;
      pool.createdTime = moment(pool.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.closeTime = moment(pool.closingTime * 1000).format('MM/DD/YYYY [@] hh:mm a');
      pool.returnTime = moment(pool.returnTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.wagered = (pool.amountWagered + pool.fadeAmountWagered) / 100;
      pool.cap = pool.maxBalance / 100;
      pool.min = pool.minInvestment / 100;
      pool.max = pool.maxInvestment / 100;
      pool.users = Object.keys(users).map(k => ({ ...users[k], id: k }))
        .filter(user => user.investments && Object.keys(user.investments).includes(pool.id))
        .map(user => ({ ...user, ...userIdentities[user.id] }))
        .map(user => {
          let timeOfWager = wagers.sort((a, b) => b.time - a.time).find(w => {
            return w.userId === user.publicId && w.fundId === pool.id;
          });
          timeOfWager = timeOfWager && timeOfWager.time;
          user.timeOfWager = moment(timeOfWager).format('MM/DD/YYYY [@] hh:mm a');
          user.contribution = user.investments[pool.id] / 100;
          return user;
        });
      const wagersArr = [...(pool.wagers && Object.keys(pool.wagers).map(w => bets[w] || {})) || [], ...(pool.fadeWagers && Object.keys(pool.fadeWagers).map(w => bets[w] || {})) || []];
      
      pool.wagersArr = wagersArr.map(w => {
        const game = (appData[w.gameLeague] && appData[w.gameLeague][w.gameId]) || {};
        w.createdTime = moment(w.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
        w.gameTime = moment(game.scheduledTimeUnix).format('MM/DD/YYYY [@] hh:mm a');
        w.gameName = game.description !== ' vs ' ? game.description : `${game.awayTeamName} vs ${game.homeTeamName}`;
        w.details = `${w.points || ''} ${w.selection || w.overUnder}`;
        w.amountWagered = w.wagered / 100;
        w.score = `${game.awayTeamScore} - ${game.homeTeamScore}`;
        w.winloss = (w.status === 'RETURNED' && (w.returned > 0 ? 'Win' : 'Loss')) || 'N/A';
        return w;
      });
      pool.createdTime = moment(pool.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.closeTime = moment(pool.closingTime * 1000).format('MM/DD/YYYY [@] hh:mm a');
      pool.returnTime = moment(pool.returnTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      pool.wagered = pool.amountWagered / 100;
    }
    return pool || {};
  }
);
