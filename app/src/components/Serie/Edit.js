import React, { useState } from "react";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import SerieConfigurator from "./SerieConfigurator";

function EditSerie({ socket, close, currentSerie }) {
  const [socketError, setSocketError] = useState(null);

  return (
    <SerieConfigurator
      title={"Edit serie"}
      onSubmit={(data) => {
        socket.emit("/api/series/update", data, (data) => {
          const value = JSON.parse(data);
          if (value.error) {
            setSocketError(value.error);
          } else {
            close();
          }
        });
      }}
      onClose={close}
      dialog="edit"
      currentConfig={currentSerie}
      socketError={socketError}
    />
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(EditSerie);
