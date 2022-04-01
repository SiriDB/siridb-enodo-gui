import React, { useState } from "react";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import SerieConfigurator from "./SerieConfigurator";

function AddSerie({ socket, close }) {
  const [socketError, setSocketError] = useState(null);

  return (
    <SerieConfigurator
      title="Add serie"
      onSubmit={(data) => {
        socket.emit("/api/series/create", data, (data) => {
          const value = JSON.parse(data);
          if (value.error) {
            setSocketError(value.error);
          } else {
            close();
          }
        });
      }}
      onClose={close}
      dialog="add"
      socketError={socketError}
    />
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(AddSerie);
