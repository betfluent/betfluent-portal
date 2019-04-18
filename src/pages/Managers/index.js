import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import GlobalStats from '../../components/core/GlobalStats';
import { getManagerData } from '../../selectors/managers';
import { autoSize } from '../../utils';
import 'ag-grid-enterprise';

function comparator(a, b) {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}

function nameKeyCreator(params) {
  var { name } = params.value;
  return name;
}

function currencyFormatter(params) {
  return '$' + formatNumber(params.value);
}

function numberFormatter(params) {
  return formatNumber(params.value)
}

function percentFormatter(params) {
  return formatNumber(params.value) + '%';
}

function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const ManagerLink = ({ value }) => {
  return <Link className="global-link" to={`/managers/${value.id}`}>{value.name}</Link>
}

const frameworkComponents = {
  linkRenderer: ManagerLink
}

const columnDefs = [
  {headerName: "Manager Name", field: "name", cellRenderer: 'linkRenderer', comparator: comparator, keyCreator: nameKeyCreator},
  {headerName: "Total Amount Raised", field: "amountRaised", valueFormatter: currencyFormatter},
  {headerName: "Number of Pools Created", field: "poolsCreated"},
  {headerName: "Average Pool Size", field: "averagePoolSize", valueFormatter: numberFormatter},
  {headerName: "Total Earnings", field: "totalEarnings", valueFormatter: currencyFormatter},
  {headerName: "Total Wins", field: "totalWins"},
  {headerName: "Total Losses", field: "totalLosses"},
  {headerName: "Win %", field: "winPct", valueFormatter: percentFormatter},
  {headerName: "State", field: "company"},
  {headerName: "Last Date/Time Pool Created", field: "lastPoolCreated"}
];

const Managers = ({ managers }) => {
  if (!managers) return null;
  return (
    <>
      <GlobalStats />
      <div className="ag-theme-material global-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={managers}
          onGridReady={autoSize}
          frameworkComponents={frameworkComponents}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  managers: getManagerData(state)
});

export default {
  component: connect(mapStateToProps)(Managers)
}
