import React from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function EditSerie({ close, currentSerie }) {

    return (
        <SerieConfigurator
            title={"Edit serie"}
            onSubmit={(data) => {
                socket.emit('/api/series/update', data);
                close();
            }}
            onClose={close}
            dialog='edit'
            currentSerie={currentSerie}
        />
    )
};

export default EditSerie;