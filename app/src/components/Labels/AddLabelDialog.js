import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';

import { socket } from '../../store';

export default function AddLabelDialog({ open, handleClose }) {

    const [name, setName] = useState('');
    const [grouptag, setGrouptag] = useState('');

    const onSubmit = () => {
        const data = { name, grouptag };
        socket.emit('/api/enodo/labels/create', data, () => {
            handleClose();
        });
    };

    const isInvalid = name === '' || grouptag === '';

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{"Add label"}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Label name"
                                variant="outlined"
                                defaultValue={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                label="Group/Tag name"
                                variant="outlined"
                                defaultValue={grouptag}
                                onChange={(e) => {
                                    setGrouptag(e.target.value);
                                }}
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Alert severity='info'>
                            {'The term label is used for group and tag selections in SiriDB. Creating a label results in adding all series belonging to the specified SiriDB group or tag name.'}
                        </Alert>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {'Cancel'}
                </Button>
                <Button onClick={onSubmit} color="primary" disabled={isInvalid}>
                    {'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
