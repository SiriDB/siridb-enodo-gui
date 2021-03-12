import React from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function AddSerie({ close }) {

    return (
        <SerieConfigurator
            title='Add serie'
            onSubmit={(data) => {
                socket.emit('/api/series/create', data);
                close();
            }}
            onClose={close}
            dialog='add'
        />
    )
};

export default AddSerie;