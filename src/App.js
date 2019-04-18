import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import moment from 'moment';
import pages from './pages';
import { isAuth } from './selectors';
import Authenticated from './templates/Authenticated';
import Public from './templates/Public';

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few Seconds',
    ss: '%d Seconds',
    m: '1 Minute',
    mm: '%d Minutes',
    h: '1 Hour',
    hh: '%d Hours',
    d: '1 Day',
    dd: '%d Days',
    M: '1 Month',
    MM: '%d Months',
    y: '1 Year',
    yy: '%d Years'
  }
});

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: document.getElementById('jss-insertion-point')
});

const CustomRoute = ({
  template: Template,
  page: Page,
  path,
  authRoute,
  auth,
  redirect,
  location
}) => {
  if (path !== '*' && ((authRoute && !auth) || (!authRoute && auth)))
    return <Redirect to={redirect} />;
  /* eslint-disable no-param-reassign */
  if (path === '*') Template = auth ? Authenticated : Public;
  return (
    <Template location={location}>
      <Page location={location} />
    </Template>
  );
};

CustomRoute.propTypes = {
  template: PropTypes.func,
  page: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  authRoute: PropTypes.bool,
  auth: PropTypes.any,
  redirect: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any).isRequired
};

CustomRoute.defaultProps = {
  authRoute: false,
  auth: false,
  redirect: '',
  template: () => null
};

const App = ({ ...rest }) => {
  if (rest.auth === undefined) return null;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <IntlProvider locale="en">
        <Switch>
          {pages.map((r, i) => (
            <CustomRoute key={i} {...r.route} {...rest} />
          ))}
        </Switch>
      </IntlProvider>
    </JssProvider>
  );
};

const mapStateToProps = state => ({
  auth: isAuth(state)
});

export default withRouter(connect(mapStateToProps)(App));
