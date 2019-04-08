import React, {Component} from 'react';
import {RPSComponent} from 'react-pubsub-store';

import SettingsStore from './RPSStores/SettingsStore'
import ReactPubSubStore from 'react-pubsub-store';
import {Link} from "react-router-dom";


class AnalyseSettings extends RPSComponent {
    constructor(props) {
        super(props);
        this.setStores([SettingsStore]);

        this.state = {
            settings: {},
            minPoints: ""
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.settings.min_data_points !== prevState.settings.min_data_points) {
            this.setState({
                minPoints: this.state.settings.min_data_points,
            });
        }
    }

    componentDidMount() {
        this.setState({
            minPoints: this.state.settings.min_data_points,
        });
    }

    render() {
        return (
            <div className="">
                <form>
                    <div className="form-group">
                        <label htmlFor="minPoints">Minimal amount of points</label>
                        <input type="text" className="form-control" id="minPoints"
                               value={this.state.minPoints}
                               onChange={(e) => {
                                   this.setState({
                                       minPoints: e.target.value
                                   });
                               }}
                               placeholder="amount of points"/>
                    </div>
                    <button className="btn btn-primary"
                            onClick={() => {
                                ReactPubSubStore.publish('/settings', {
                                    min_data_points: this.state.minPoints
                                }, "POST", (data) => {
                                    console.log(data);
                                });
                            }}>Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default AnalyseSettings;
