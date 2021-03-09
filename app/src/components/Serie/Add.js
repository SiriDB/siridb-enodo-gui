import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState } from "react";
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import { socket, useGlobal } from '../../store';

const AddSerie = (props) => {
    const closeCb = props.close;

    const [name, setName] = useState("");

    const [models] = useGlobal(
        state => state.enodo_model
    );

    // Config

    // Job models
    const [baseAnalysisJobModel, setBaseAnalysisJobModel] = useState("");
    const [forecastJobModel, setForcastJobModel] = useState("");
    const [anomalyDetectionJobModel, setAnomalyDetectionJobModel] = useState("");
    const [staticRuleJobModel, setStaticRuleJobModel] = useState("");

    // Job schedule
    const [baseAnalysisJobSchedule, setBaseAnalysisJobSchedule] = useState(200);
    const [forecastJobSchedule, setForcastJobSchedule] = useState(200);
    const [anomalyDetectionJobSchedule, setAnomalyDetectionJobSchedule] = useState(200);
    const [staticRuleJobSchedule, setStaticRuleJobSchedule] = useState(200);

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
                <FormControl variant="outlined" fullWidth >
                    <InputLabel >{'Base Analysis Job Model'}</InputLabel>
                    <Select
                        value={baseAnalysisJobModel}
                        onChange={(e) => {
                            setBaseAnalysisJobModel(e.target.value);
                        }}
                        label={'Base Analysis Job Model'}
                    >
                        <MenuItem value="">
                            <em>{'None'}</em>
                        </MenuItem>
                        {models.map((model) => (
                            <MenuItem value={model.model_name}>
                                {model.model_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br /><br />
                <FormControl variant="outlined" fullWidth >
                    <InputLabel >{'Forecast Job Model'}</InputLabel>
                    <Select
                        value={forecastJobModel}
                        onChange={(e) => {
                            setForcastJobModel(e.target.value);
                        }}
                        label={'Forecast Job Model'}
                    >
                        <MenuItem value="">
                            <em>{'None'}</em>
                        </MenuItem>
                        {models.map((model) => (
                            <MenuItem value={model.model_name}>
                                {model.model_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br /><br />
                <FormControl variant="outlined" fullWidth >
                    <InputLabel >{'Anomaly Detection Job Model'}</InputLabel>
                    <Select
                        value={anomalyDetectionJobModel}
                        onChange={(e) => {
                            setAnomalyDetectionJobModel(e.target.value);
                        }}
                        label={'Anomaly Detection Job Model'}
                    >
                        <MenuItem value="">
                            <em>{'None'}</em>
                        </MenuItem>
                        {models.map((model) => (
                            <MenuItem value={model.model_name}>
                                {model.model_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br /><br />
                <FormControl variant="outlined" fullWidth >
                    <InputLabel >{'Static Rule Job Model'}</InputLabel>
                    <Select
                        value={staticRuleJobModel}
                        onChange={(e) => {
                            setStaticRuleJobModel(e.target.value);
                        }}
                        label={'Static Rule Job Model'}
                    >
                        <MenuItem value="">
                            <em>{'None'}</em>
                        </MenuItem>
                        {models.map((model) => (
                            <MenuItem value={model.model_name}>
                                {model.model_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Base Analysis Job Schedule"
                        variant="outlined"
                        value={baseAnalysisJobSchedule}
                        onChange={(e) => {
                            setBaseAnalysisJobSchedule(e.target.value);
                        }}
                        type='number'
                    />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Forecast Job Schedule"
                        variant="outlined"
                        value={forecastJobSchedule}
                        onChange={(e) => {
                            setForcastJobSchedule(e.target.value);
                        }}
                        type='number'
                    />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Anomaly Detection Job Schedule"
                        variant="outlined"
                        value={anomalyDetectionJobSchedule}
                        onChange={(e) => {
                            setAnomalyDetectionJobSchedule(e.target.value);
                        }}
                        type='number'
                    />
                </FormControl>
                <br /><br />
                <FormControl fullWidth>
                    <TextField id="outlined-basic"
                        label="Static Rule Job Schedule"
                        variant="outlined"
                        value={staticRuleJobSchedule}
                        onChange={(e) => {
                            setStaticRuleJobSchedule(e.target.value);
                        }}
                        type='number'
                    />
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
                                        job_anomaly_detect: anomalyDetectionJobModel,
                                        job_static_rules: staticRuleJobModel
                                    },
                                    job_schedule: {
                                        job_base_analysis: baseAnalysisJobSchedule,
                                        job_forecast: forecastJobSchedule,
                                        job_anomaly_detect: anomalyDetectionJobSchedule,
                                        job_static_rules: staticRuleJobSchedule
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
                            if (data.config.job_models.job_static_rules === "") {
                                delete data.config.job_models.job_static_rules;
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
                            if (data.config.job_schedule.job_static_rules === "") {
                                delete data.config.job_schedule.job_static_rules;
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