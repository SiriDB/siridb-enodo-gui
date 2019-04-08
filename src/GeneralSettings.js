import React, {Component} from 'react';
import {RPSComponent} from 'react-pubsub-store';

import SettingsStore from './RPSStores/SettingsStore'
import ReactPubSubStore from 'react-pubsub-store';
import {Link} from "react-router-dom";


class GeneralSettings extends RPSComponent {
    constructor(props) {
        super(props);
        this.setStores([SettingsStore]);

        this.state = {
            settings: {},
            dataPath: "",
            pipePath: ""
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.settings.analysis_save_path !== prevState.settings.analysis_save_path || this.state.settings.pipe_path !== prevState.settings.pipe_path) {
            this.setState({
                dataPath: this.state.settings.analysis_save_path,
                pipePath: this.state.settings.pipe_path
            });
        }
    }

    componentDidMount() {
        this.setState({
            dataPath: this.state.settings.analysis_save_path,
            pipePath: this.state.settings.pipe_path
        });
    }

    render() {
        console.log(this.state.settings);
        return (
            <div className="">
                <form>
                    <div className="form-group">
                        <label htmlFor="dataPath">Data path</label>
                        <input type="text" className="form-control" id="dataPath"
                               value={this.state.dataPath}
                               onChange={(e) => {
                                   this.setState({
                                       dataPath: e.target.value
                                   });
                               }}
                               placeholder="Data path"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pipePath">Path for pipe</label>
                        <input type="text" className="form-control" id="pipePath"
                               value={this.state.pipePath}
                               onChange={(e) => {
                                   this.setState({
                                       pipePath: e.target.value
                                   });
                               }}
                               placeholder="Pipe path"/>
                    </div>
                    <button  className="btn btn-primary"
                             onClick={() => {
                                 ReactPubSubStore.publish('/settings', {
                                     analysis_save_path: this.state.dataPath,
                                     pipe_path: this.state.pipePath
                                 }, "POST", (data) => {
                                     console.log(data);
                                 });
                             }}>Submit</button>
                </form>
            </div>
        );
    }
}

export default GeneralSettings;
