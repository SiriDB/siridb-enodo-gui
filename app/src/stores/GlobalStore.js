import Vlow from "vlow";
import io from "socket.io-client";
import update from "react-addons-update";

import GlobalActions from "../actions/GlobalActions";

const INITIAL_STATE = {
  authenticated: null,
  enodo_clients: {},
  enodo_log: [],
  models: [],
  enodo_status: {},
  event_output: [],
  job: [],
  series: [],
  settings: null,
  siridb_status: {},
  socket: null,
};

class GlobalStore extends Vlow.Store {
  constructor() {
    // Call super with the actions to which this store should
    // listen too.
    super(GlobalActions);

    // Create the initial state
    this.state = { ...INITIAL_STATE };

    const s = io.connect(process.env.REACT_APP_ENODO_HUB_URI, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
    });
    this.setState({ socket: s });
  }

  onUpdateStoreValue(key, value, append) {
    if (append === undefined) {
      append = false;
    }
    if (append) {
      let alreadyExists = false;
      let list = this.state[key];
      list.forEach((item, index) => {
        if (item.rid === value.rid) {
          item = value;
          alreadyExists = true;
        }
      });
      let obj = {};
      if (alreadyExists) {
        obj[key] = list;
        this.setState(obj);
      } else {
        list.push(value);
        obj[key] = list;
        this.setState(obj);
      }
    } else {
      let obj = {};
      obj[key] = value;
      this.setState(obj);
    }
  }

  onUpdateStoreResourceItem(resource, entity_id, value) {
    let indexOfEntity = this.state[resource].findIndex(
      (x) => x.rid === entity_id
    );
    if (indexOfEntity !== null) {
      let obj = {};
      obj[resource] = update(this.state[resource], {
        [indexOfEntity]: { $set: value },
      });
      this.setState(obj);
    }
  }

  onDeleteStoreResourceItem(resource, entity_id) {
    let indexOfEntity = this.state[resource].findIndex(
      (x) => x.rid === entity_id
    );
    if (indexOfEntity >= 0) {
      this.setState(
        update(this.state, { [resource]: { $splice: [[indexOfEntity, 1]] } })
      );
    }
  }
}

export default GlobalStore;
