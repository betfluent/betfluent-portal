import React from 'react';
import TextField from '@material-ui/core/TextField';
import './index.scss';

const InputField = ({ className, id, label, value, onChange, ...rest }) => (
  <div className="input-field-wrapper">
    <TextField
      InputProps={{
        classes: {
          underline: 'input-field__underline'
        }
      }}
      InputLabelProps={{
        classes: {
          focused: 'input-field__label'
        }
      }}
      className={className}
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      margin="normal"
      {...rest}
    />
  </div>
);

export default InputField;
