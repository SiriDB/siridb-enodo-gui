import React, { useState } from "react";

import SerieConfigurator from './SerieConfigurator';
import { socket } from '../../store';

function EditSerie({ close, currentSerie }) {

    const [socketError, setSocketError] = useState(null);

    return (
        <SerieConfigurator
            title={"Edit serie"}
            onSubmit={(data) => {
                socket.emit('/api/series/update', data, (data) => {
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
            dialog='edit'
            currentConfig={currentSerie}
            socketError={socketError}
        />
    )
};

export default EditSerie;