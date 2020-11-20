import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React from "react";

const SerieDetails = (props) => {

    const closeCb = props.close;

    return (
        <Dialog
            fullWidth={true}
            maxWidth='lg'
            open={true}
            onClose={() => {}}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">Serie Data</DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCb} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default SerieDetails;