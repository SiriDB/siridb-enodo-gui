import React, {Component} from 'react';
import {RPSComponent} from 'react-pubsub-store';

import TimeSeriesStore from './RPSStores/TimeSeriesStore'
import ReactPubSubStore from 'react-pubsub-store';
import {Chart} from "react-google-charts";
import {Link} from "react-router-dom";

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";


class TimeSeriesContainer extends RPSComponent {
    constructor(props) {
        super(props);
        this.setStores([TimeSeriesStore]);

        this.state = {
            series: [],
            addSerieModalState: false,
            m: 12,
            serieName: "",
            unit: "ms",
            plotPoints: [],
            rightClickSelectedSerie: ""
        }
    }

    removeTimeserieFromAnalyser(serieName) {
        console.log(this.state.rightClickSelectedSerie);
        ReactPubSubStore.publish('/series/' + serieName, {}, "DELETE", (data) => {
            console.log(data);
            ReactPubSubStore.update('/series');
        });
    }

    render() {
        let chartData = [["x", "data", "forecast"]];
        chartData = chartData.concat(this.state.plotPoints);
        return (
            <div className="container">
                <ContextMenu id="SIMPLE">
                    <MenuItem data={{}} onClick={() => {
                        this.removeTimeserieFromAnalyser(this.state.rightClickSelectedSerie);
                    }}>
                        Delete
                    </MenuItem>
                </ContextMenu>
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
                        <div style={{textAlign: "right"}}>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                this.setState({addSerieModalState: true})
                            }}>Add
                            </button>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Serie name</th>
                                <th>Is Analysed</th>
                                {/*<th>unit</th>*/}
                                {/*<th>m</th>*/}
                                {/*<th>d</th>*/}
                                {/*<th>D</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.series && this.state.series.map((serie) => {
                                return <tr key={serie.name}
                                           style={{cursor: "pointer"}}
                                           className="row-hover"
                                           onClick={() => {
                                               if (serie.analysed) {
                                                   ReactPubSubStore.publish('/series/' + serie.name, {}, "GET", (data) => {
                                                       console.log(data);
                                                       // let points = data.points.concat(data.forecast_points);
                                                       let points = [];
                                                       for (let i = 0; i < (data.points.length + data.forecast_points.length); i++) {
                                                           if (i < data.points.length) {
                                                               points.push([data.points[i][0], data.points[i][1], null]);
                                                           } else {
                                                               points.push([data.forecast_points[i - data.points.length][0], null, data.forecast_points[i - data.points.length][1]]);
                                                           }
                                                       }
                                                       this.setState({
                                                           plotPoints: points
                                                       });
                                                   });
                                               }
                                           }}>
                                    <td><ContextMenuTrigger
                                        id="SIMPLE"><span onContextMenu={() => {
                                        console.log("hiu");
                                        this.setState({
                                            rightClickSelectedSerie: serie.name
                                        });
                                    }
                                    }>{serie.name}</span></ContextMenuTrigger></td>
                                    <td>{serie.analysed ? "yes" : "no"}</td>
                                    {/*<td>{serie.type}</td>*/}
                                    {/*<td>{serie.parameters.m}</td>*/}
                                    {/*<td>{serie.parameters.d}</td>*/}
                                    {/*<td>{serie.parameters.D}</td>*/}
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 col-md-8 offset-md-1">
                        {this.state.plotPoints.length ? <Chart
                            chartType="LineChart"
                            data={chartData}
                            width="100%"
                            height="400px"
                            legendToggle
                        /> : "Select a time serie"}
                    </div>
                    {this.state.addSerieModalState &&
                    <div className="modal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add time serie</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <label>Serie Name</label>
                                    <input className="form-control" onChange={(e) => {
                                        this.setState({
                                            serieName: e.target.value
                                        })
                                    }} value={this.state.serieName}/>
                                    <label>Unit</label>
                                    <input className="form-control" onChange={(e) => {
                                        this.setState({
                                            unit: e.target.value
                                        })
                                    }} value={this.state.unit}/>
                                    <label>m</label>
                                    <input className="form-control" onChange={(e) => {
                                        this.setState({
                                            m: e.target.value
                                        })
                                    }} value={this.state.m}/>
                                    <label>d</label>
                                    <input className="form-control" onChange={(e) => {
                                        this.setState({
                                            d: e.target.value
                                        })
                                    }} value={this.state.d}/>
                                    <label>D</label>
                                    <input className="form-control" onChange={(e) => {
                                        this.setState({
                                            D: e.target.value
                                        })
                                    }} value={this.state.D}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary"
                                            onClick={() => {
                                                this.setState({
                                                    addSerieModalState: false
                                                });
                                                ReactPubSubStore.publish('/series', {
                                                    name: this.state.serieName,
                                                    unit: this.state.unit,
                                                    m: this.state.m,
                                                    d: this.state.d,
                                                    D: this.state.D
                                                }, "POST", (data) => {
                                                    console.log(data);
                                                });
                                            }}>Save
                                    </button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                            onClick={() => {
                                                this.setState({
                                                    addSerieModalState: false
                                                });
                                            }}>Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default TimeSeriesContainer;
