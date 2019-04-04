import {RPSStore} from 'react-pubsub-store';

class TimeSeriesStore extends RPSStore {
    constructor() {
        super("/series", "series");
    }
}

export default TimeSeriesStore;