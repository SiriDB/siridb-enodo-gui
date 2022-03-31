import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ErrorDialog({open, handleClose, error}) {

  return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            {'Close'}
          </Button>
        </DialogActions>
      </Dialog>
  );
}