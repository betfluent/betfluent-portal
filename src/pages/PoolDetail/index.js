import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { getPoolDetail } from '../../selectors/pools';
import { autoSize, dateComparator, currencyFormatter } from '../../utils';
import 'ag-grid-enterprise';
import './index.scss';

const columnDefs = [
  {headerName: "First Name", field: "firstName"},
  {headerName: "Last Name", field: "lastName"},
  {headerName: "State", field: "addressState"},
  {headerName: "Date of Birth", field: "dateOfBirth"},
  {headerName: "Time of Last Wager", field: "timeOfWager", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Total Contribution", field: "contribution", valueFormatter: currencyFormatter}
];

const columnDefsBets = [
  {headerName: "Date/Time of Bet", field: "createdTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Date/Time of Game", field: "gameTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Game Bet On", field: "gameName"},
  {headerName: "Type of Bet", field: "type"},
  {headerName: "Requested Bet Details", field: "details"},
  {headerName: "Requested Odds", field: "returning"},
  {headerName: "Last Updated Odds", field: "returning"},
  {headerName: "Amount Wagered", field: "amountWagered", valueFormatter: currencyFormatter},
  {headerName: "Score of Game", field: "score"},
  {headerName: "Bet Status", field: "status"},
  {headerName: "Win or Lose", field: "winloss"}
];

const PoolDetail = ({ pool }) => {
  if (!pool) return null;
  return (
    <>
      <div className="global-details">
        <div className="pool-name">{pool.name}</div>
        <div className="pool-manager">{pool.managerName}{' \u00B7 '}<span className="pool-details">{pool.league}{' \u00B7 '}{pool.status}</span></div>
        <div className="pool-stats">
          <span className="pool-wagered">${pool.wagered}</span>{' \u00B7 '}${pool.min}{' \u00B7 '}${pool.max}{' \u00B7 '}${pool.cap}
        </div>
        <div className="pool-time">Created on {pool.createdTime}
          {' \u00B7 '}
          {pool.closingTime * 1000 > Date.now() ? `Closing on ` : `Closed on `}{pool.closeTime}
          {' \u00B7 '}
          {pool.returnTimeMillis > Date.now() ? `Returning on ` : `Returned on `}{pool.returnTime}
        </div>
      </div>
      <div className="ag-theme-material global-detail-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={pool.users}
          onGridReady={autoSize}
        />
      </div>
      <div className="pool-detail-placeholder" />
      <div className="ag-theme-material global-detail-grid">
        <AgGridReact
          columnDefs={columnDefsBets}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={pool.wagersArr}
          onGridReady={autoSize}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  pool: getPoolDetail(state)
});

export default {
  component: connect(mapStateToProps)(PoolDetail)
}
