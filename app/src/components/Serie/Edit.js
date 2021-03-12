import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function EditSerie({ close, currentSerie }) {

    return (
        <Dialog
            open={true}
            onClose={close}
            fullWidth
            maxWidth='md'
        >
            <DialogTitle>{"Edit serie"}</DialogTitle>
            <DialogContent dividers>
                {currentSerie &&
                    <SerieConfigurator
                        onSubmit={(data) => {
                            console.log(data);
                            socket.emit('/api/series/update', data);
                            close();
                        }}
                        dialog='edit'
                        currentSerie={currentSerie}
                    />}
            </DialogContent>
        </Dialog>
    )
};

export default EditSerie;