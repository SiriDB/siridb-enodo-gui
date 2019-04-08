import React, {Component} from 'react';
import {RPSComponent} from 'react-pubsub-store';

import ReactPubSubStore from 'react-pubsub-store';
import GeneralSettings from './GeneralSettings';
import AnalyseSettings from './AnalyseSettings';
import {Link} from "react-router-dom";


class Settings extends RPSComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedCat: 'general'
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <ul className="inline-list-group">
                            <Link to="/series">
                                <li className="list-group-item menu-item">Time series</li>
                            </Link>
                            <Link to="/settings">
                                <li className="list-group-item menu-item">Settings</li>
                            </Link>
                        </ul>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="row">
                    <div className="col-12 col-md-3">
                        <table className="table">
                            <tbody>
                            <tr style={{cursor: 'pointer'}}
                                onClick={() => {
                                    this.setState({
                                        selectedCat: 'general'
                                    });
                                }}>
                                <td>General settings</td>
                            </tr>
                            <tr style={{cursor: 'pointer'}}
                                onClick={() => {
                                    this.setState({
                                        selectedCat: 'analyse'
                                    });
                                }}>
                                <td>Analyse settings</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 col-md-8 offset-md-1">
                        {this.state.selectedCat === 'general' ? <GeneralSettings/> : <AnalyseSettings/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;
