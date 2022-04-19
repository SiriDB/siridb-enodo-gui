import React, { useState } from "react";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import SerieConfigurator from "../Serie/SerieConfigurator";

function AddLabelDialog({ socket, handleClose }) {
  const [loading, setLoading] = useState(false);

  const onSubmit = (config) => {
    setLoading(true);
    socket.emit("/api/enodo/labels/create", config, () => {
      handleClose();
      setLoading(false);
    });
  };

  return (
    <SerieConfigurator
      title="Add label"
      onSubmit={onSubmit}
      onClose={handleClose}
      dialog="addLabel"
      loading={loading}
    />
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(AddLabelDialog);
