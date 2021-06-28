import React from "react";

import SerieConfigurator from '../Serie/SerieConfigurator';
import { socket } from '../../store';

export default function AddLabelDialog({ handleClose }) {

    const onSubmit = (config) => {
        socket.emit('/api/enodo/labels/create', config, () => {
            handleClose();
        });
    };

    return (
        <SerieConfigurator
            title='Add label'
            onSubmit={onSubmit}
            onClose={handleClose}
            dialog='addLabel'
        />
    );
}
