import React from "react";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import SerieConfigurator from '../Serie/SerieConfigurator';

function AddLabelDialog({ socket, handleClose }) {

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

export default withVlow({
    store: GlobalStore,
    keys: ["socket"],
  })(AddLabelDialog);
  