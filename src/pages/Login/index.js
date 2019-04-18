import React from 'react';
import { connect } from 'react-redux';
import { getAuthError, getFormData } from '../../selectors';
import { updateFormData, sendFormData } from '../../actions';
import InputField from '../../components/core/InputField';
import Button from '../../components/core/Button';
import saga from './saga';
import './index.scss';

const Login = ({ error, email, password, updateField, sendData }) => (
  <div className="global-login">
    <div className="global-logo-login" />
    <form noValidate>
      <InputField className="global-login__field" inputProps={{ autoComplete: 'new-password' }} label="Email" value={email} onChange={updateField} id="email" />
      <InputField className="global-login__field" inputProps={{ autoComplete: 'new-password' }} label="Password" value={password} onChange={updateField} id="password" type="password" />
      <div className="global-login__button">
        <Button onClick={sendData} disabled={!email || !password}>LOGIN</Button>
      </div>
      {
        error && <div className="global-login__error">{error}</div>
      }
    </form>
  </div>
);

const mapStateToProps = state => {
  const { email = '', password = '' } = getFormData(state);
  return {
    error: getAuthError(state),
    email,
    password
  }
};

const mapDispatchToProps = dispatch => ({
  updateField: ({ target: { value, id }}) => { dispatch(updateFormData({ [id]: value }))},
  sendData: () => { dispatch(sendFormData()) }
});

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Login),
  saga
}
