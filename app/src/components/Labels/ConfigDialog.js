import React from "react";

import SerieConfigurator from '../Serie/SerieConfigurator';

export default function ConfigDialog({ handleClose, label }) {

    return (
        <SerieConfigurator
            title='Label configuration'
            onClose={handleClose}
            dialog='infoLabel'
            currentConfig={label}
        />
    );
}
