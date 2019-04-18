import { createSelector } from 'reselect';
import moment from 'moment';
import { getAppData, isAppLoading } from './index';

export const getBetData = createSelector(
  getAppData,
  isAppLoading,
  (appData,appLoading) => {
    if (appLoading) return false;
    const { bets = {}, managers = {}, pools = {} } = appData;
    const betData = Object.keys(bets).map(k => bets[k]).map(b => {
      const bet = { ...b };
      const game = (appData[bet.gameLeague] && appData[bet.gameLeague][bet.gameId]) || {};
      const pool = pools[bet.fundId] || {};
      const manager = managers[bet.managerId] || {};
      const gameScore = game.status !== 'scheduled' && game.status !== 'created' && game.status !== 'postponed';
      bet.createdTime = moment(bet.createdTimeMillis).format('MM/DD/YYYY [@] hh:mm a');
      bet.gameTime = moment(game.scheduledTimeUnix).format('MM/DD/YYYY [@] hh:mm a');
      bet.gameName = game.description !== ' vs ' ? game.description : `${game.awayTeamName} vs ${game.homeTeamName}`;
      bet.details = `${bet.points || ''} ${bet.selection || bet.overUnder}`;
      bet.amountWagered = (bet.wagered / 100) || 0;
      bet.score = gameScore ? `${game.awayTeamScore || 0} - ${game.homeTeamScore || 0}` : 'Not Started';
      bet.winloss = (bet.status === 'RETURNED' && (bet.returned > 0 ? 'Win' : 'Loss')) || 'N/A';
      bet.poolName = pool.name;
      bet.fake = pool.isTraining;
      bet.managerName = manager.name;
      return bet;
    });
    return betData.filter(b => !b.fake);
  }
);
