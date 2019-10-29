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
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
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
    const [enodo_models, setEnodo_models] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    const [globalState, globalActions] = useGlobal();

    const series = globalState.series;

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
        console.log("here");
        socket.emit('/api/series/details', {serie_name: serie.name}, (data) => {
            data = JSON.parse(data).data;
            // let points = data.points.concat(data.forecast_points);
            console.log(data);

            let points = [];
            if (serie.analysed) {
                let history = data.points;
                // let history = data.points.slice(Math.max(data.points.length - (data.forecast_points.length * 100), 1));
                for (let i = 0; i < (history.length + data.forecast_points.length); i++) {
                    if (i < history.length) {
                        // points.push([new Date(history[i][0]), history[i][1], null]);
                        points.push(_pointWithConditionalAnomaly([new Date(history[i][0]), history[i][1], null], data.anomalies));
                    } else {
                        // points.push([new Date(data.forecast_points[i - history.length][0]), null, data.forecast_points[i - history.length][1]]);
                        points.push(_pointWithConditionalAnomaly([new Date(data.forecast_points[i - history.length][0]), null, data.forecast_points[i - history.length][1]], data.anomalies));
                    }
                }

                for (let i = 0; i < (data.anomalies.length); i++) {
                    points.push([new Date(data.anomalies[i][0]), null, null, data.anomalies[i][1]]);
                }
            } else {
                let history = data.points;
                for (let i = 0; i < (history.length); i++) {
                    points.push([new Date(history[i][0]), history[i][1]]);
                }
            }
            setSelectedSerie(serie.name);
            setViewType("graph");
            setPlotPoints(points);
            setCharFormat(serie.analysed ? ["x", "data", "forecast", "anomalies"] : ["x", "data"]);
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

    const modalStyle = getModalStyle();
    let chartData = [charFormat];
    chartData = chartData.concat(plotPoints);
    return (
        <div className="">
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Paper className={styles.paper}>
                        <div style={{margin: "20px", padding: "10px 0"}}>
                            <div style={{textAlign: "right"}}>
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    setAddSerieModalState(true);
                                }}>Add
                                </button>
                            </div>
                            <List>
                                {series && series.map((serie) => {
                                    return (
                                        <ListItem>
                                            <ListItemText
                                                primary={serie.name}
                                                secondary={`Analysed: ${(serie.analysed === true ? "yes" : "no")}`}
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
                                                <IconButton aria-label="Delete">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>);
                                })}
                            </List>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={styles.paper}>

                        {(selectedSerie === "" || selectedSerie === null) && "Select a serie"}
                        {viewType === "graph" &&
                        <Chart
                            chartType="LineChart"
                            data={chartData}
                            options={{
                                backgroundColor: "#424242",
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
                        }
                        {viewType === "info" &&
                        <Info serie={selectedSerie}/>
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
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={addSerieModalState}
                    onClose={() => {
                        this.setState({
                            addSerieModalState: false
                        });
                    }}>
                    <div style={modalStyle} className={classes.paper}>
                        <Paper className={styles.paper} style={{minWidth: '100%', padding: '20px'}}>
                            <h2 id="simple-modal-title">Add serie</h2>
                            <div>
                                <InputLabel htmlFor="age-simple">Age</InputLabel>
                                <Select
                                    style={{minWidth: '100%'}}
                                    value={selectedModel}
                                    onChange={(e) => {
                                        this.handleModalChange(e);
                                    }}
                                    inputProps={{
                                        name: 'selectedModel',
                                        id: 'selectedModel',
                                    }}>
                                    {Object.keys(enodo_models.models).map((model_id) => {
                                        return <MenuItem
                                            value={model_id}>{enodo_models.models[model_id]}</MenuItem>
                                    })}
                                </Select>
                            </div>
                            <FormControl className={styles.formControl}>
                                <button
                                    onClick={() => {
                                        this.setState({
                                            addSerieModalState: false
                                        });
                                        ReactPubSubStore.publish('/series', {
                                            name: serieName,
                                            unit: unit,
                                            m: m,
                                            d: d,
                                            D: D
                                        }, "POST", (data) => {
                                            console.log(data);
                                        });
                                    }}
                                />
                            </FormControl>
                        </Paper>
                    </div>
                </Modal>
                }
            </div>
        </div>
    );
}

export default TimeSeriesContainer;
