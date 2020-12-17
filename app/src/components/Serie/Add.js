import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';

import { socket } from '../../store';

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

    return (
        <Dialog
            open={true}
            onClose={closeCb}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='md'
        >
            <DialogTitle id="alert-dialog-title">{"Add serie"}</DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Serie name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Base Analysis Job Model"
                        variant="outlined"
                        value={baseAnalysisJobModel}
                        onChange={(e) => {
                            setBaseAnalysisJobModel(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Forecast Job Model"
                        variant="outlined"
                        value={forecastJobModel}
                        onChange={(e) => {
                            setForcastJobModel(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Anomaly Detection Job Model"
                        variant="outlined"
                        value={anomalyDetectionJobModel}
                        onChange={(e) => {
                            setAnomalyDetectionJobModel(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Base Analysis Job Schedule"
                        variant="outlined"
                        value={baseAnalysisJobSchedule}
                        onChange={(e) => {
                            setBaseAnalysisJobSchedule(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Forecast Job Schedule"
                        variant="outlined"
                        value={forecastJobSchedule}
                        onChange={(e) => {
                            setForcastJobSchedule(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Anomaly Detection Job Schedule"
                        variant="outlined"
                        value={anomalyDetectionJobSchedule}
                        onChange={(e) => {
                            setAnomalyDetectionJobSchedule(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Min. Data points"
                        variant="outlined"
                        value={minDataPoints}
                        onChange={(e) => {
                            setMinDataPoints(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Model params (json key=>value)"
                        variant="outlined"
                        value={modelParams}
                        onChange={(e) => {
                            setModelParams(e.target.value);
                        }} />
                </FormControl>
                <br /><br />
                <FormControl>
                    <Button
                        variant="contained"
                        color='primary'
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

                            socket.emit('/api/series/create', data);
                            closeCb();
                        }}
                    >
                        {'Add'}
                    </Button>
                </FormControl>
            </DialogContent>
        </Dialog>
    )
};

export default AddSerie;