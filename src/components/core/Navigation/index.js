import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { signOut } from '../../../services/firebaseService';
import './index.scss';

const menu = [
  {
    label: 'BETS',
    url: '/bets'
  },
  {
    label: 'POOLS',
    url: '/pools'
  },
  {
    label: 'MANAGERS',
    url: '/managers'
  },
  {
    label: 'USERS',
    url: '/users'
  }
];

const Navigation = ({ location }) => (
  <AppBar position="fixed" className="global-navigation">
    <div className="global-logo" />
    <div className="global-navigation__items">
      {menu.map(({ label, url }, i) => (
        <ListItem
          key={i}
          component={Link}
          to={url}
          className={
            location === url
              ? 'global-navigation__item active'
              : 'global-navigation__item'
          }
        >
          <span className="global-navigation_label">{label}</span>
        </ListItem>
      ))}
      <Button variant="outlined" className="global-navigation__logout" onClick={signOut}>
        SIGN OUT
      </Button>
    </div>
  </AppBar>
);

export default Navigation;
