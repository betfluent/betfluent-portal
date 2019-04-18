import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import Button from '../../components/core/Button';
import CustomDialog from '../../components/core/Dialog';
import { openDialog } from '../../actions';
import { getUserDetail } from '../../selectors/users';
import { autoSize, currencyFormatter, formatNumber } from '../../utils';
import 'ag-grid-enterprise';
import saga from './saga';
import './index.scss';

const columnDefs = [
  {headerName: "Name of Pool", field: "name"},
  {headerName: "Name of Manager", field: "managerName"},
  {headerName: "League", field: "league"},
  {headerName: "Time of Last Wager", field: "timeOfWager"},
  {headerName: "Status", field: "status"},
  {headerName: "Amount Wagered", field: "userWagered", valueFormatter: currencyFormatter}
];

const UserDetail = ({ user, dispatch }) => {
  if (!user) return null;
  return (
    <>
      <div className="global-details">
        <div className="user-name">
          <div>{user.name}</div>
          <div className="user-promote"><Button disabled={!!user.managerId} onClick={() => dispatch(openDialog())}>MAKE MANAGER</Button></div>
        </div>
        <div className="user-email">{user.email}</div>
        <div>
          <span className="user-address">{user.address}{` | `}</span>
          <span className="user-dob">{user.dob}</span>
        </div>
        <div className="user-amounts">Total Deposits
          <span className="user-deposits"> ${user.totalDeposits}</span>
          {' \u00B7 '}
          Win %  <span className="user-win">{formatNumber(user.winPct)}%</span>
          {' \u00B7 '}
          Account Balance <span className="user-deposits">${formatNumber(user.realBalance)}</span>
        </div>
      </div>
      <div className="ag-theme-material global-detail-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={user.pools}
          onGridReady={autoSize}
        />
      </div>
      <CustomDialog />
    </>
  )
};

const mapStateToProps = state => ({
  user: getUserDetail(state)
});

export default {
  component: connect(mapStateToProps)(UserDetail),
  saga
}
