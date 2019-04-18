import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import Checkbox from '@material-ui/core/Checkbox';
import GlobalStats from '../../components/core/GlobalStats';
import { getUserData } from '../../selectors/users';
import { autoSize, dobComparator, currencyFormatter, percentFormatter } from '../../utils';
import 'ag-grid-enterprise';
import './index.scss';

function comparator(a, b) {
  if (a.last > b.last) return 1;
  if (a.last < b.last) return -1;
  return 0;
}

function nameKeyCreator(params) {
  var { last } = params.value;
  return last;
}

const UserLink = ({ value }) => {
  return <Link className="global-link" to={`/users/${value.id}`}>{value.last}</Link>
}

const IsManager = ({ value }) => {
  return (
    <Checkbox
      checked={value}
      disabled
    />
  )
}

const columnDefs = [
  {headerName: "First Name", field: "first"},
  {headerName: "Last Name", field: "last", cellRenderer: 'linkRenderer', comparator: comparator, keyCreator: nameKeyCreator},
  {headerName: "Address", field: "address"},
  {headerName: "Date of Birth", field: "dob", filter: 'agDateColumnFilter', comparator: dobComparator},
  {headerName: "Email", field: "email"},
  {headerName: "Contribution", field: "contribution", valueFormatter: currencyFormatter},
  {headerName: "Total Deposits", field: "totalDeposits", valueFormatter: currencyFormatter},
  {headerName: "Account Balance", field: "realBalance", valueFormatter: currencyFormatter},
  {headerName: "Win %", field: "winPct", valueFormatter: percentFormatter},
  {headerName: "Manager?", field: "isManager", cellRenderer: 'checkRenderer'}
];

const rowClassRules = {
  'is-manager': ({ data }) => data.isManager
}

const frameworkComponents = {
  linkRenderer: UserLink,
  checkRenderer: IsManager
}

const Users = ({ users }) => {
  if (!users) return null;
  return (
    <>
      <GlobalStats />
      <div className="ag-theme-material global-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={users}
          onGridReady={autoSize}
          frameworkComponents={frameworkComponents}
          rowClassRules={rowClassRules}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  users: getUserData(state)
});

export default {
  component: connect(mapStateToProps)(Users)
}
