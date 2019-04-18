import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../../components/core/Navigation';
import './index.scss';

const Template = ({ children, location }) => (
  <>
    <Navigation location={location.pathname} />
    <div className="app-container">
      {children}
    </div>
  </>
);

Template.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired
};

export default Template;
