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
            store.setState(list)
        } else {
            list.push(value);
            obj[key] = list;
            store.setState(list)
        }
    } else {
        let obj = {};
        obj[key] = value;
        store.setState(obj);
    }
};

export const updateUserProfile = (store) => {
    // fetch new profile obj
};