import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Menu from './Menu.js';
import TimeSeriesContainer from './TimeSeriesContainer.js';
import Settings from './Settings.js';
import {HashRouter, Route, Switch} from 'react-router-dom';
import ReactPubSubStore from "react-pubsub-store";
import Fetcher from "./util/Fetcher";


ReactPubSubStore.setDAO(Fetcher);

ReactDOM.render(
    <main>
        <div className="container-fluid">
            <div className="row">
                <div className="col-12" style={{height: "200px"}}>
                    <img src="logo.png" className="mx-auto" style={{marginTop: "80px", display: "block"}}/>
                </div>
            </div>
            <div className="row">
                <HashRouter>
                    <Switch>
                        <Route exact path='/' component={Menu}/>
                        <Route path='/series' component={TimeSeriesContainer}/>
                        <Route path='/settings' component={Settings}/>
                    </Switch>
                </HashRouter>
            </div>
        </div>
    </main>
    , document.getElementById('root'));
