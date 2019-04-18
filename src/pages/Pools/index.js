import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import GlobalStats from '../../components/core/GlobalStats';
import { getPoolData } from '../../selectors/pools';
import { autoSize, dateComparator, currencyFormatter } from '../../utils';
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

const PoolLink = ({ value }) => {
  return <Link className="global-link" to={`/pools/${value.id}`}>{value.name}</Link>
}

const frameworkComponents = {
  linkRenderer: PoolLink
}

const columnDefs = [
  {headerName: "Name of Pool", field: "name", cellRenderer: 'linkRenderer', comparator: comparator, keyCreator: nameKeyCreator},
  {headerName: "Name of Manager", field: "managerName"},
  {headerName: "League", field: "league"},
  {headerName: "Created Time", field: "createdTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Close Time", field: "closeTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Return Time", field: "returnTime", filter: 'agDateColumnFilter', comparator: dateComparator},
  {headerName: "Status", field: "status"},
  {headerName: "Amount Wagered", field: "wagered", valueFormatter: currencyFormatter},
  {headerName: "Bets Placed", field: "betCount"}
];

const Pools = ({ pools }) => {
  if (!pools) return null;
  return (
    <>
      <GlobalStats />
      <div className="ag-theme-material global-grid">
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef = {{ resizable: true, sortable: true, filter: true }}
          rowData={pools}
          onGridReady={autoSize}
          frameworkComponents={frameworkComponents}
        />
      </div>
    </>
  )
};

const mapStateToProps = state => ({
  pools: getPoolData(state)
});

export default {
  component: connect(mapStateToProps)(Pools)
}
