import React from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';

const CustomButton = ({ ...rest }) => (
  <Button
    variant="contained"
    classes={{
      root: 'button',
      label: 'button__label'
    }}
    {...rest}
  />
);

export default CustomButton;
