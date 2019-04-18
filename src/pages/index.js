import React from 'react';
import Login from './Login';
import Bets from './Bets';
import Pools from './Pools';
import PoolDetail from './PoolDetail';
import Managers from './Managers';
import ManagerDetail from './ManagerDetail';
import Users from './Users';
import UserDetail from './UserDetail';
import Public from '../templates/Public';
import Authenticated from '../templates/Authenticated';

const Page = () => <div>Hello world</div>;

export default [
  {
    route: {
      exact: true,
      path: '/',
      redirect: '/bets',
      page: Login.component,
      template: Public
    },
    loadSaga: Login.saga
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/bets',
      redirect: '/',
      page: Bets.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/pools',
      redirect: '/',
      page: Pools.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/pools/:id',
      redirect: '/',
      page: PoolDetail.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/managers',
      redirect: '/',
      page: Managers.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/managers/:id',
      redirect: '/',
      page: ManagerDetail.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/users',
      redirect: '/',
      page: Users.component,
      template: Authenticated
    },
    loadSaga: false
  },
  {
    route: {
      exact: true,
      authRoute: true,
      path: '/users/:id',
      redirect: '/',
      page: UserDetail.component,
      template: Authenticated
    },
    loadSaga: UserDetail.saga
  },
  {
    route: {
      path: '*',
      page: Page
    },
    loadSaga: false
  }
];
