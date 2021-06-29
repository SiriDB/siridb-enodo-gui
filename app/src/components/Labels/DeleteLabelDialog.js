import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { socket } from '../../store';

export default function DeleteLabelDialog({ open, handleClose, selectedLabel }) {

    const onDelete = () => {
        const data = { selector: selectedLabel.name };
        socket.emit('/api/enodo/labels/delete', data, () => {
            handleClose();
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{'Delete label?'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {'Are you sure you want to delete this label? This results in the removal of all related series from Enodo.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {'Cancel'}
                </Button>
                <Button onClick={onDelete} color="primary">
                    {'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
