import {RPSStore} from 'react-pubsub-store';

class SettingsStore extends RPSStore {
    constructor() {
        super("/settings", "settings");
    }
}

export default SettingsStore;