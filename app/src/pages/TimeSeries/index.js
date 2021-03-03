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

import AddSerie from "../../components/Serie/Add";
import BasicPageLayout from '../../components/BasicPageLayout';
import Info from "../../components/Serie/Info";
import SerieDetails from "../../components/Serie/Dialog";
import { useGlobal, socket } from '../../store';

const styles = theme => ({
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
});

const TimeSeriesPage = () => {
    const [addSerieModalState, setAddSerieModalState] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState("");
    const [viewType, setViewType] = useState("");

    const [series] = useGlobal(
        state => state.series
    );

    const _pointWithConditionalAnomaly = (point, anomalies) => {
        if (anomalies !== undefined && anomalies.length) {
            point[3] = null;
        }
        return point;
    };

    const showChart = (serie) => {
        socket.emit('/api/series/details', { series_name: serie.name }, (data) => {
            const parsed_data = JSON.parse(data).data;

            let points = [];
            if (hasForecast(serie)) {
                let history = parsed_data.points;
                for (let i = 0; i < (history.length + parsed_data.forecast_points.length); i++) {
                    if (i < history.length) {
                        points.push(_pointWithConditionalAnomaly([new Date(history[i][0] * 1000), history[i][1], null], parsed_data.anomalies));
                    } else {
                        points.push(_pointWithConditionalAnomaly([new Date(parsed_data.forecast_points[i - history.length][0] * 1000), null, parsed_data.forecast_points[i - history.length][1]], parsed_data.anomalies));
                    }
                }
                for (let i = 0; i < (parsed_data.anomalies.length); i++) {
                    points.push([new Date(parsed_data.anomalies[i][0] * 1000), null, null, parsed_data.anomalies[i][1]]);
                }
            } else {
                let history = parsed_data.points;
                for (let i = 0; i < (history.length); i++) {
                    points.push([new Date(history[i][0] * 1000), history[i][1]]);
                }
            }
            let cData = [hasAnomaliesDetected(serie) ? ["x", "data", "forecast", "annomaly"] : hasForecast(serie) ? ["x", "data", "forecast"] : ["x", "data"]];
            cData = cData.concat(points);
            setChartData(cData);
            setSelectedSerie(serie.name);
            setViewType("graph");
        });
    };

    const isAnalysed = (serie) => {
        return (serie.job_statuses.job_base_analysis !== undefined && serie.job_statuses.job_base_analysis === 3);
            // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

    const hasForecast = (serie) => {
        return (serie.job_statuses.job_forecast !== undefined && serie.job_statuses.job_forecast === 3);
            // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

    const hasAnomaliesDetected = (serie) => {
        return (serie.job_statuses.job_anomaly_detect !== undefined && serie.job_statuses.job_anomaly_detect === 3) || (serie.job_statuses.job_realtime_anomaly_detect !== undefined && serie.job_statuses.job_realtime_anomaly_detect === 3);
            // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

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
                                                                socket.emit(`/api/series/delete`, data);
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
            <div className="row">
                {addSerieModalState &&
                    <AddSerie close={() => { setAddSerieModalState(false) }} />
                }
            </div>
        </BasicPageLayout>
    );
}

export default TimeSeriesPage;
