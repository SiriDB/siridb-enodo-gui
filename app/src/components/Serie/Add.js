import React, { useState } from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function AddSerie({ close }) {

    const [socketError, setSocketError] = useState(null);

    return (
        <SerieConfigurator
            title='Add serie'
            onSubmit={(data) => {
                socket.emit('/api/series/create', data, (data) => {
                    const value = JSON.parse(data);
                    if (value.error) {
                        setSocketError(value.error);
                    }
                    else {
                        close();
                    }
                });
            }}
            onClose={close}
            dialog='add'
            socketError={socketError}
        />
    )
};

export default AddSerie;