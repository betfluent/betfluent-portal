import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { getManagerDetail } from '../../selectors/managers';
import { autoSize, dateComparator, currencyFormatter } from '../../utils';
import 'ag-grid-enterprise';
import './index.scss';

const columnDefs = [
  {headerName: "Name of Pool", field: "name", cellRenderer: "agGroupCellRenderer"},
  {headerName: "League", field: "league"},
  {headerName: "Created Time", field: "createdTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Close Time", field: "closeTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Return Time", field: "returnTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Status", field: "status"},
  {headerName: "Amount Wagered", field: "wagered", valueFormatter: currencyFormatter}
];

const detailCellRendererParams = {
  detailGridOptions: {
    columnDefs: [
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
    ],
    onFirstDataRendered: autoSize
  },
  getDetailRowData: (params) => {
    params.successCallback(params.data.wagersArr);
  }
}

const ManagerDetail = ({ manager }) => {
  if (!manager) return null;
  return (
    <>
      <div className="global-details">
        <div className="manager-name">{manager.name}</div>
        <span className="manager-email">{manager.email} - <span className="manager-state">{manager.company}</span></span>
      </div>
      <div className="ag-theme-material global-detail-grid">
        <AgGridReact
          columnDefs={columnDefs}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={manager.poolsArr}
          onGridReady={autoSize}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  manager: getManagerDetail(state)
});

export default {
  component: connect(mapStateToProps)(ManagerDetail)
}
