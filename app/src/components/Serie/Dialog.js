import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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