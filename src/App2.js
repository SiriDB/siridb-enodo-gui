import React, {Component} from 'react';
import ReactPubSubStore from 'react-pubsub-store';

import RepoGrid from "./RepoGrid";
import Fetcher from './util/Fetcher';

class App extends Component {
    constructor(props) {
        super(props);
        ReactPubSubStore.setDAO(Fetcher);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title"></h1>
                </header>
                <div className="container">
                    <RepoGrid/>
                </div>
            </div>
        );
    }
}

export default App;
