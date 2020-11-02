import React, {useState} from 'react';

import {Chart} from "react-google-charts";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {ContextMenu, MenuItem, ContextMenuTrigger} from "react-contextmenu";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DeleteIcon from "@material-ui/icons/Delete"
import ShowChartIcon from "@material-ui/icons/ShowChart"
import InfoIcon from "@material-ui/icons/Info"
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItem from "@material-ui/core/ListItem/ListItem";
import List from "@material-ui/core/List/List";

import Info from "./Serie/Info";
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import {useGlobal, socket} from './store';
import SerieDetails from "./Serie/Dialog";
import AddSerie from "./Serie/Add";

const styles = theme => ({
    root: {
        display: 'flex',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '100%',
    }
});

const classes = theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        // boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
});


const TimeSeriesContainer = (props) => {
    const [addSerieModalState, setAddSerieModalState] = useState(false);
    const [serieName, setSerieName] = useState("");
    const [plotPoints, setPlotPoints] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState("");
    const [viewType, setViewType] = useState("");
    const [charFormat, setCharFormat] = useState(["x", "data", "forecast"]);
    const [selectedModel, setSelectedModel] = useState(null);

    const [series, defaultAction] = useGlobal(
        state => state.series,
        actions => actions.defaultAction
    );

    const [enodo_models, _] = useGlobal(
        state => state.enodo_models,
        actions => null
    );

    console.log(series);

    const removeTimeserieFromAnalyser = (serieName) => {
        console.log(rightClickSelectedSerie);
        // ReactPubSubStore.publish('/series/' + serieName, {}, "DELETE", (data) => {
        //     console.log(data);
        //     ReactPubSubStore.update('/series');
        // });
    };

    const _pointWithConditionalAnomaly = (point, anomalies) => {
        if (anomalies !== undefined && anomalies.length) {
            point[3] = null;
        }
        return point;
    };

    const showChart = (serie) => {
        // ReactPubSubStore.publish('/series/' + serie.name, {}, "GET", (data) => {
        socket.emit('/api/series/details', {series_name: serie.name}, (data) => {
            data = JSON.parse(data).data;
            // let points = data.points.concat(data.forecast_points);
            console.log("HEREDATA", data);

            let points = [];
            if (isAnalysed(serie)) {
                let history = data.points;
                // let history = data.points.slice(Math.max(data.points.length - (data.forecast_points.length * 100), 1));
                for (let i = 0; i < (history.length + data.forecast_points.length); i++) {
                    if (i < history.length) {
                        // points.push([new Date(history[i][0]), history[i][1], null]);
                        points.push(_pointWithConditionalAnomaly([new Date(history[i][0] * 1000), history[i][1], null], data.anomalies));
                    } else {
                        // points.push([new Date(data.forecast_points[i - history.length][0]), null, data.forecast_points[i - history.length][1]]);
                        points.push(_pointWithConditionalAnomaly([new Date(data.forecast_points[i - history.length][0] * 1000), null, data.forecast_points[i - history.length][1]], data.anomalies));
                    }
                }

                for (let i = 0; i < (data.anomalies.length); i++) {
                    points.push([new Date(data.anomalies[i][0] * 1000), null, null, data.anomalies[i][1]]);
                }
            } else {
                let history = data.points;
                for (let i = 0; i < (history.length); i++) {
                    points.push([new Date(history[i][0] * 1000), history[i][1]]);
                }
            }

            setSelectedSerie(serie.name);
            setViewType("graph");
            setPlotPoints(points);
            setCharFormat(isAnalysed(serie) ? ["x", "data", "forecast", "annomaly"] : ["x", "data"]);
            console.log("HJA:::AP", points)
        });
    };

    const getModalStyle = () => {
        const top = 50;

        return {
            top: `${top}%`,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute',
            minWidth: '300px',
            maxWidth: '700px',
        };
    };

    const handleModalChange = (event) => {
        let obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    };

    const isAnalysed = (serie) => {
        return (serie.job_statuses.job_base_analysis !== undefined && serie.job_statuses.job_base_analysis == 3)
    };

    const modalStyle = getModalStyle();
    let chartData = [charFormat];
    chartData = chartData.concat(plotPoints);
    return (
        <div className="">
            <Grid container spacing={24}>
                <Grid item xs={12}>
                            <div>
                                <div style={{float: "left"}}>
                                    <h2>Series</h2>
                                </div>
                                <div style={{float: "right"}}>
                                    <button type="button" className="btn btn-primary" onClick={() => {
                                        setAddSerieModalState(true);
                                    }}>Add
                                    </button>
                                </div>
                                <div style={{clear: "both"}}></div>
                            </div>
                            <List style={{maxHeight: 'calc(100vh - 200px)', overflow: 'auto'}}>
                                {series.length < 1 ? <div className="centered-message">No series found</div> : ""}
                                {series && series.map((serie) => {
                                    return (
                                        <Paper className={styles.paper} key={serie.name}>
                                            <div style={{margin: "20px", padding: "10px 0"}}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={serie.name}
                                                        secondary={`Analysed: ${(isAnalysed(serie) === true ? "yes" : "no")}`}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton aria-label="Show info"
                                                                    onClick={() => {
                                                                        setViewType('info');
                                                                        setSelectedSerie(serie.name);
                                                                    }}>
                                                            <InfoIcon/>
                                                        </IconButton>
                                                        <IconButton onClick={() => {
                                                            showChart(serie);
                                                        }} aria-label="Show graph">
                                                            <ShowChartIcon/>
                                                        </IconButton>
                                                        <IconButton aria-label="Delete" onClick={() => {
                                                            var data = {name: serie.name};
                                                            socket.emit(`/api/series/delete`, data, (status, data, message) => {
                                                                console.log(status, data, message);
                                                                
                                                            });
                                                        }}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </div>
                                        </Paper>);
                                })}
                            </List>
                        {/* </div>
                    </Paper> */}
                </Grid>
                <Grid item xs={12} hidden>
                    <Paper className={styles.paper}>

                        {(selectedSerie === "" || selectedSerie === null) && "Select a serie"}
                        {viewType === "graph" &&
                        <SerieDetails close={() => {
                            setViewType('');
                            setSelectedSerie(null);
                        }}>
                            <Chart
                                chartType="LineChart"
                                data={chartData}
                                options={{
                                    // backgroundColor: "#424242",
                                    explorer: {
                                        actions: ['dragToZoom', 'rightClickToReset'],
                                        axis: 'horizontal',
                                        keepInBounds: true,
                                        maxZoomIn: 4.0
                                    },
                                    series: {
                                        2: {pointShape: 'circle', pointSize: 10, lineWidth: 0},
                                    }
                                }}
                                width="100%"
                                height="400px"
                                legendToggle
                            />
                        </SerieDetails>
                        }
                        {viewType === "info" &&
                        <SerieDetails close={() => {
                            setViewType('');
                            setSelectedSerie(null);
                        }}>
                            <Info serie={selectedSerie}/>
                        </SerieDetails>
                        }
                    </Paper>
                </Grid>
            </Grid>
            <ContextMenu id="SIMPLE">
                <MenuItem data={{}} onClick={() => {
                    this.removeTimeserieFromAnalyser(rightClickSelectedSerie);
                }}>
                    Delete
                </MenuItem>
            </ContextMenu>
            <div className="row">
                {addSerieModalState &&
                <AddSerie close={() => {setAddSerieModalState(false)}}/>
                }
            </div>
        </div>
    );
}

export default TimeSeriesContainer;
