import React from 'react';
import { connect } from 'react-redux';
import { getGlobalStats } from '../../../selectors';
import { formatNumber } from '../../../utils';
import './index.scss';

const GlobalStats = ({ users, managers, deposits, wagers }) => {
  if (!users) return null;
  return (
    <div className="global-stats-wrapper">
      <div className="global-stats">
        <span>USERS <span className="global-stats__user">{users}</span></span>
        {' \u00B7 '}
        <span>MANAGERS <span className="global-stats__user">{managers}</span></span>
        {' \u00B7 '}
        <span>DEPOSITS <span className="global-stats__deposits">${formatNumber(deposits)}</span></span>
        {' \u00B7 '}
        <span>WAGERS <span className="global-stats__wagers">${formatNumber(wagers)}</span></span>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  ...getGlobalStats(state)
});

export default connect(mapStateToProps)(GlobalStats);
