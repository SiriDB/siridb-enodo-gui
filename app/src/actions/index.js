import update from 'react-addons-update';

export const __updateStoreValue = (store, key, value, append) => {
    if (append === undefined) {
        append = false;
    }
    if (append) {
        let alreadyExists = false;
        let list = store.state[key];
        list.forEach((item, index) => {
            if (item.id === value.id) {
                item = value;
                alreadyExists = true;
            }
        });
        let obj = {};
        if (alreadyExists) {
            obj[key] = list;
            store.setState(obj)
        } else {
            list.push(value);
            obj[key] = list;
            store.setState(obj)
        }
    } else {
        let obj = {};
        obj[key] = value;
        store.setState(obj);
    }
};

export const __updateStoreResourceItem = (store, resource, entity_id, value) => {
    let indexOfEntity = store.state[resource].findIndex(x => x.id === entity_id);
    if (indexOfEntity !== null) {
        let obj = {};
        obj[resource] = update(store.state[resource], { [indexOfEntity]: { $set: value } });
        store.setState(obj);
    }
};

export const __deleteStoreResourceItem = (store, resource, entity_id) => {
    let indexOfEntity = store.state[resource].findIndex(x => x.id === entity_id);
    if (indexOfEntity >= 0) {
        store.setState(update(store.state, { [resource]: { $splice: [[indexOfEntity, 1]] } }));
    }
};