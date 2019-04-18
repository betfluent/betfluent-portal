import moment from 'moment';

export const autoSize = ({ columnApi }) => {
  const allColumnIds = [];
  columnApi.getAllColumns().forEach((column) => {
    allColumnIds.push(column.colId);
  });
  columnApi.autoSizeColumns(allColumnIds);
}

export const dateComparator = (a, b) => {
  const first = moment(a, 'MM/DD/YYYY [@] hh:mm a').toDate();
  const second = moment(b, 'MM/DD/YYYY [@] hh:mm a').toDate();
  if (first > second) return 1;
  if (first < second) return -1;
  return 0;
}

export const dobComparator = (a, b) => {
  const first = moment(a).toDate();
  const second = moment(b).toDate();
  if (first > second) return 1;
  if (first < second) return -1;
  return 0;
}

export const formatNumber = (number) => {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const percentFormatter = (params) => {
  return formatNumber(params.value) + '%';
}

export const currencyFormatter = (params) => {
  return '$' + formatNumber(params.value);
}
