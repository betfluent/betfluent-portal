import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import GlobalStats from '../../components/core/GlobalStats';
import { getBetData } from '../../selectors/bets';
import { autoSize, dateComparator, currencyFormatter } from '../../utils';
import 'ag-grid-enterprise';
import './index.scss';

const columnDefs = [
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
  {headerName: "Win or Lose", field: "winloss"},
  {headerName: "Pool Name", field: "poolName"},
  {headerName: "Manager Name", field: "managerName"}
];

const rowClassRules = {
  'is-fade': ({ data }) => data.fade
}

const Bets = ({ bets }) => {
  if (!bets) return null;
  return (
    <>
      <GlobalStats />
      <div className="ag-theme-material global-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={bets}
          onGridReady={autoSize}
          rowClassRules={rowClassRules}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  bets: getBetData(state)
});

export default {
  component: connect(mapStateToProps)(Bets)
}
