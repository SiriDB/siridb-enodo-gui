import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function AddSerie({ close }) {

    return (
        <Dialog
            open={true}
            onClose={close}
            fullWidth
            maxWidth='md'
        >
            <DialogTitle>{"Add serie"}</DialogTitle>
            <DialogContent dividers>
                <SerieConfigurator
                    onSubmit={(data) => {
                        console.log(data);
                        socket.emit('/api/series/create', data);
                        close();
                    }}
                    dialog='add'
                />
            </DialogContent>
        </Dialog>
    )
};

export default AddSerie;