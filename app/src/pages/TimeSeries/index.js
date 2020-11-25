import DeleteIcon from "@material-ui/icons/Delete"
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InfoIcon from "@material-ui/icons/Info"
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import ShowChartIcon from "@material-ui/icons/ShowChart"
import { Chart } from "react-google-charts";
import { ContextMenu, MenuItem } from "react-contextmenu";

import AddSerie from "../../components/Serie/Add";
import BasicPageLayout from '../../components/BasicPageLayout';
import Info from "../../components/Serie/Info";
import SerieDetails from "../../components/Serie/Dialog";
import { useGlobal, socket } from '../../store';

const styles = theme => ({
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});

const TimeSeriesPage = () => {
    const [addSerieModalState, setAddSerieModalState] = useState(false);
    const [plotPoints, setPlotPoints] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState("");
    const [viewType, setViewType] = useState("");
    const [charFormat, setCharFormat] = useState(["x", "data", "forecast"]);

    const [series, defaultAction] = useGlobal(
        state => state.series,
        actions => actions.defaultAction
    );

    const [enodo_models, _] = useGlobal(
        state => state.enodo_models,
        actions => null
    );

    const removeTimeserieFromAnalyser = (serieName) => {
        // console.log(rightClickSelectedSerie);
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
        socket.emit('/api/series/details', { series_name: serie.name }, (data) => {
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

    const isAnalysed = (serie) => {
        return (serie.job_statuses.job_base_analysis !== undefined && serie.job_statuses.job_base_analysis === 3)
    };

    let chartData = [charFormat];
    chartData = chartData.concat(plotPoints);
    return (
        <BasicPageLayout
            title='Series'
            buttonAction={() => setAddSerieModalState(true)}
            buttonText='Add'
        >
            <Grid container>
                <Grid item xs={12}>
                    <List style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        {series.length < 1 ? <div className="centered-message">No series found</div> : ""}
                        {series &&
                            <Grid container direction='column' spacing={2}>
                                {series.map((serie) => {
                                    return (
                                        <Grid item key={serie.name}>
                                            <Paper className={styles.paper}>
                                                <div style={{ padding: "10px 0" }}>
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
                                                                <InfoIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => {
                                                                showChart(serie);
                                                            }} aria-label="Show graph">
                                                                <ShowChartIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="Delete" onClick={() => {
                                                                var data = { name: serie.name };
                                                                socket.emit(`/api/series/delete`, data, (status, data, message) => {
                                                                    console.log(status, data, message);

                                                                });
                                                            }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </div>
                                            </Paper>
                                        </Grid>);
                                })}
                            </Grid>}
                    </List>
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
                                            2: { pointShape: 'circle', pointSize: 10, lineWidth: 0 },
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
                                <Info serie={selectedSerie} />
                            </SerieDetails>
                        }
                    </Paper>
                </Grid>
            </Grid>
            <ContextMenu id="SIMPLE">
                <MenuItem data={{}} onClick={() => {
                    // removeTimeserieFromAnalyser(rightClickSelectedSerie);
                }}>
                    Delete
                </MenuItem>
            </ContextMenu>
            <div className="row">
                {addSerieModalState &&
                    <AddSerie close={() => { setAddSerieModalState(false) }} />
                }
            </div>
        </BasicPageLayout>
    );
}

export default TimeSeriesPage;
