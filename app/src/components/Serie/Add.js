import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import React, { useState } from "react";
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

import { socket } from '../../store';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    paper: {
        padding: theme.spacing(2),
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
const AddSerie = (props) => {

    const closeCb = props.close;

    const [name, setName] = useState("");

    // Config

    // Job models
    const [baseAnalysisJobModel, setBaseAnalysisJobModel] = useState("");
    const [forecastJobModel, setForcastJobModel] = useState("");
    const [anomalyDetectionJobModel, setAnomalyDetectionJobModel] = useState("");

    // Job schedule
    const [baseAnalysisJobSchedule, setBaseAnalysisJobSchedule] = useState(200);
    const [forecastJobSchedule, setForcastJobSchedule] = useState(200);
    const [anomalyDetectionJobSchedule, setAnomalyDetectionJobSchedule] = useState(200);

    const [minDataPoints, setMinDataPoints] = useState(200);

    const [modelParams, setModelParams] = useState("");

    const getModalStyle = () => {
        const top = 50;

        return {
            top: `${top}px`,
            left: 0,
            right: 0,
            margin: 'auto',
            position: 'absolute',
            minWidth: '300px',
            maxWidth: '700px',
        };
    };

    const modalStyle = getModalStyle();

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={true}
            onClose={() => {
                closeCb();
            }}>
            <div style={modalStyle} className={classes.paper}>
                <Paper className={styles.paper} style={{ minWidth: '100%', padding: '20px' }}>
                    <h2 id="simple-modal-title">Add serie</h2>
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Serie name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Base Analysis Job Model"
                            variant="outlined"
                            value={baseAnalysisJobModel}
                            onChange={(e) => {
                                setBaseAnalysisJobModel(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Forecast Job Model"
                            variant="outlined"
                            value={forecastJobModel}
                            onChange={(e) => {
                                setForcastJobModel(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Anomaly Detection Job Model"
                            variant="outlined"
                            value={anomalyDetectionJobModel}
                            onChange={(e) => {
                                setAnomalyDetectionJobModel(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Base Analysis Job Schedule"
                            variant="outlined"
                            value={baseAnalysisJobSchedule}
                            onChange={(e) => {
                                setBaseAnalysisJobSchedule(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Forecast Job Schedule"
                            variant="outlined"
                            value={forecastJobSchedule}
                            onChange={(e) => {
                                setForcastJobSchedule(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Anomaly Detection Job Schedule"
                            variant="outlined"
                            value={anomalyDetectionJobSchedule}
                            onChange={(e) => {
                                setAnomalyDetectionJobSchedule(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Min. Data points"
                            variant="outlined"
                            value={minDataPoints}
                            onChange={(e) => {
                                setMinDataPoints(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl} fullWidth>
                        <TextField id="outlined-basic"
                            label="Model params (json key=>value)"
                            variant="outlined"
                            value={modelParams}
                            onChange={(e) => {
                                setModelParams(e.target.value);
                            }} />
                    </FormControl>
                    <br /><br />
                    <FormControl className={styles.formControl}>
                        <Button variant="contained" color='primary'
                            onClick={() => {
                                var data = {
                                    name: name,
                                    config: {
                                        job_models: {
                                            job_base_analysis: baseAnalysisJobModel,
                                            job_forecast: forecastJobModel,
                                            job_anomaly_detect: anomalyDetectionJobModel
                                        },
                                        job_schedule: {
                                            job_base_analysis: baseAnalysisJobSchedule,
                                            job_forecast: forecastJobSchedule,
                                            job_anomaly_detect: anomalyDetectionJobSchedule
                                        },
                                        min_data_points: minDataPoints,
                                        model_params: modelParams === "" ? {} : JSON.parse(modelParams)
                                    }
                                };

                                if (data.config.job_models.job_base_analysis === "") {
                                    delete data.config.job_models.job_base_analysis;
                                }
                                if (data.config.job_models.job_forecast === "") {
                                    delete data.config.job_models.job_forecast;
                                }
                                if (data.config.job_models.job_anomaly_detect === "") {
                                    delete data.config.job_models.job_anomaly_detect;
                                }

                                if (data.config.job_schedule.job_base_analysis === "") {
                                    delete data.config.job_schedule.job_base_analysis;
                                }
                                if (data.config.job_schedule.job_forecast === "") {
                                    delete data.config.job_schedule.job_forecast;
                                }
                                if (data.config.job_schedule.job_anomaly_detect === "") {
                                    delete data.config.job_schedule.job_anomaly_detect;
                                }

                                console.log("HOI", data);

                                socket.emit('/api/series/create', data, (status, data, message) => {
                                    console.log(status, data, message);
                                });
                                closeCb();
                            }}>Add</Button>
                    </FormControl>
                </Paper>
            </div>
        </Modal>
    )
};

export default AddSerie;