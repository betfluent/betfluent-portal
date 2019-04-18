import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputField from '../InputField';
import MenuItem from '@material-ui/core/MenuItem';
import { closeDialog, sendFormData, updateFormData } from '../../../actions';
import { getFormData } from '../../../selectors';
import menu from './menu';
import './index.scss';

const CustomDialog = ({ closeDialog, sendFormData, open, updateField, company, pageError }) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Make User a Manager</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To make user a manager, simply select their legal betting state below, and confirm the action.
        </DialogContentText>
        <InputField
          label="Company"
          value={company}
          onChange={updateField}
          id="company"
          SelectProps={{
            MenuProps: {
              className: 'select-menu-item',
              PaperProps: {
                style: {
                  maxHeight: 224
                }
              }
            },
          }}
          select
          fullWidth
        >
          {
            menu.map((item, i) => {
              return (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              );
            })
          }
        </InputField>
        {
          pageError && <div className="dialog-error">{pageError}</div>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} variant="text" classes={{
          root: 'button-flat',
          label: 'button-flat__label'
        }}>
          CANCEL
        </Button>
        <Button onClick={sendFormData} disabled={!company}>
          CONFIRM
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => {
  const { company = '' } = getFormData(state);
  return {
    open: state.page.dialogOpen,
    pageError: state.page.pageError && state.page.pageError.error,
    company
  };
};

const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(closeDialog()),
  sendFormData: () => dispatch(sendFormData()),
  updateField: ({ target: { value }}) => { dispatch(updateFormData({ company: value }))}
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomDialog);
