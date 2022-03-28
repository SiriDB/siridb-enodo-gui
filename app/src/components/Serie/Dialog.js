import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from "react";

const SerieDetails = (props) => {

    const closeCb = props.close;

    return (
        <Dialog
            fullWidth={true}
            maxWidth='lg'
            open={true}
            onClose={closeCb}
        >
            <DialogTitle>{'Series data'}</DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCb} color="primary">
                    {'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default SerieDetails;