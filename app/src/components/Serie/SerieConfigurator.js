import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState, Fragment } from "react";
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { JobTypes } from '../../constants/enums';
import { useGlobal } from '../../store';

function JobConfigurator({ title, jobType, config, setConfig, toggleCheckbox, changeModel, changeSchedule, changeActivitated, checkedJobs }) {

    const [models] = useGlobal(
        state => state.enodo_model
    );

    return (
        <Fragment>
            <Grid item xs={12}>
                <Grid container direction='row' justify='space-between' alignItems='center'>
                    <Grid item >
                        <Typography>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            name={jobType}
                            checked={checkedJobs[jobType]}
                            onChange={toggleCheckbox}
                            color="primary"
                        />
                    </Grid>
                </Grid>
            </Grid>
            {checkedJobs[jobType] &&
                <Fragment>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth >
                            <InputLabel required>{'Job Model'}</InputLabel>
                            <Select
                                value={config.model ? config.model : ''}
                                onChange={changeModel}
                                label={'Job Model'}
                                name={jobType}
                            >
                                <MenuItem value="">
                                    <em>{'None'}</em>
                                </MenuItem>
                                {models.map((model) => (
                                    <MenuItem value={model.model_name} key={model.model_name}>
                                        {model.model_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Job Schedule"
                                variant="outlined"
                                defaultValue={config.job_schedule}
                                onChange={changeSchedule}
                                type='number'
                                name={jobType}
                                required
                            />
                        </FormControl>
                    </Grid>
                    {config.model &&
                        <Fragment>
                            {Object.entries(models.find(m => m.model_name === config.model).model_arguments).map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label={key}
                                            variant="outlined"
                                            defaultValue={config.model_params[key]}
                                            onChange={(e) => {
                                                setConfig({ ...config, model_params: { ...config.model_params, [key]: Number(e.target.value) } });
                                            }}
                                            required={value}
                                            type='number'
                                        />
                                    </FormControl>
                                </Grid>))}
                        </Fragment>}
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={config.activated}
                                    onChange={changeActivitated}
                                    name={jobType}
                                    color="primary"
                                />
                            }
                            label="Activated"
                        />
                    </Grid>
                </Fragment>
            }
        </Fragment>
    );
};

function SerieConfigurator({ dialog, onSubmit, currentSerie }) {

    const [checkedJobs, setCheckedJobs] = useState({
        [JobTypes.JOB_BASE_ANALYSIS]: dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_BASE_ANALYSIS] ? true : false,
        [JobTypes.JOB_FORECAST]: dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_FORECAST] ? true : false,
        [JobTypes.JOB_ANOMALY_DETECT]: dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_ANOMALY_DETECT] ? true : false,
        [JobTypes.JOB_STATIC_RULES]: dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_STATIC_RULES] ? true : false
    })

    // Config

    // Name
    const [name, setName] = useState(dialog === 'edit' ? currentSerie.name : '');

    // Min no. data points
    const [minDataPoints, setMinDataPoints] = useState(dialog === 'edit' ? currentSerie.config.min_data_points : 2);

    // Job specific config
    const [baseAnalysisJobConfig, setBaseAnalysisJobConfig] = useState(dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_BASE_ANALYSIS] ? currentSerie.config.job_config[JobTypes.JOB_BASE_ANALYSIS] : null);
    const [forecastJobConfig, setForcastJobConfig] = useState(dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_FORECAST] ? currentSerie.config.job_config[JobTypes.JOB_FORECAST] : null);
    const [anomalyDetectionJobConfig, setAnomalyDetectionJobConfig] = useState(dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_ANOMALY_DETECT] ? currentSerie.config.job_config[JobTypes.JOB_ANOMALY_DETECT] : null);
    const [staticRulesJobConfig, setStaticRuleJobConfig] = useState(dialog === 'edit' && currentSerie.config.job_config[JobTypes.JOB_STATIC_RULES] ? currentSerie.config.job_config[JobTypes.JOB_STATIC_RULES] : null);


    console.log({
        name,
        minDataPoints,
        baseAnalysisJobConfig,
        forecastJobConfig,
        anomalyDetectionJobConfig,
        staticRulesJobConfig
    })

    const toggleCheckbox = (event) => {
        setCheckedJobs({ ...checkedJobs, [event.target.name]: event.target.checked });
        if (event.target.checked) {
            const defaulConfig = {
                "activated": true,
                "model": null,
                "job_schedule": 200,
                "model_params": {}
            };
            if (event.target.name === JobTypes.JOB_BASE_ANALYSIS) {
                setBaseAnalysisJobConfig(defaulConfig);
            }
            else if (event.target.name === JobTypes.JOB_FORECAST) {
                setForcastJobConfig(defaulConfig);
            }
            else if (event.target.name === JobTypes.JOB_ANOMALY_DETECT) {
                setAnomalyDetectionJobConfig(defaulConfig);
            }
            else if (event.target.name === JobTypes.JOB_STATIC_RULES) {
                setStaticRuleJobConfig(defaulConfig);
            }
        }
        else {
            if (event.target.name === JobTypes.JOB_BASE_ANALYSIS) {
                setBaseAnalysisJobConfig(null);
            }
            else if (event.target.name === JobTypes.JOB_FORECAST) {
                setForcastJobConfig(null);
            }
            else if (event.target.name === JobTypes.JOB_ANOMALY_DETECT) {
                setAnomalyDetectionJobConfig(null);
            }
            else if (event.target.name === JobTypes.JOB_STATIC_RULES) {
                setStaticRuleJobConfig(null);
            }
        }
    };

    const changeActivitated = (event) => {
        const value = event.target.checked;
        if (event.target.name === JobTypes.JOB_BASE_ANALYSIS) {
            setBaseAnalysisJobConfig({ ...baseAnalysisJobConfig, activated: value });
        }
        else if (event.target.name === JobTypes.JOB_FORECAST) {
            setForcastJobConfig({ ...forecastJobConfig, activated: value });
        }
        else if (event.target.name === JobTypes.JOB_ANOMALY_DETECT) {
            setAnomalyDetectionJobConfig({ ...anomalyDetectionJobConfig, activated: value });
        }
        else if (event.target.name === JobTypes.JOB_STATIC_RULES) {
            setStaticRuleJobConfig({ ...staticRulesJobConfig, activated: value });
        }
    }

    const changeModel = (event) => {
        const value = event.target.value;
        if (event.target.name === JobTypes.JOB_BASE_ANALYSIS) {
            setBaseAnalysisJobConfig({ ...baseAnalysisJobConfig, model: value });
        }
        else if (event.target.name === JobTypes.JOB_FORECAST) {
            setForcastJobConfig({ ...forecastJobConfig, model: value });
        }
        else if (event.target.name === JobTypes.JOB_ANOMALY_DETECT) {
            setAnomalyDetectionJobConfig({ ...anomalyDetectionJobConfig, model: value });
        }
        else if (event.target.name === JobTypes.JOB_STATIC_RULES) {
            setStaticRuleJobConfig({ ...staticRulesJobConfig, model: value });
        }
    }

    const changeSchedule = (event) => {
        const value = Number(event.target.value);
        if (event.target.name === JobTypes.JOB_BASE_ANALYSIS) {
            setBaseAnalysisJobConfig({ ...baseAnalysisJobConfig, job_schedule: value });
        }
        else if (event.target.name === JobTypes.JOB_FORECAST) {
            setForcastJobConfig({ ...forecastJobConfig, job_schedule: value });
        }
        else if (event.target.name === JobTypes.JOB_ANOMALY_DETECT) {
            setAnomalyDetectionJobConfig({ ...anomalyDetectionJobConfig, job_schedule: value });
        }
        else if (event.target.name === JobTypes.JOB_STATIC_RULES) {
            setStaticRuleJobConfig({ ...staticRulesJobConfig, job_schedule: value });
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <TextField
                        label="Serie name"
                        variant="outlined"
                        defaultValue={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        required
                        disabled={dialog === 'edit' ? true : false}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <TextField
                        label="Min. Data points"
                        variant="outlined"
                        defaultValue={minDataPoints}
                        onChange={(e) => {
                            setMinDataPoints(Number(e.target.value));
                        }}
                        type='number'
                        required
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <JobConfigurator
                title={'Base Analysis'}
                jobType={JobTypes.JOB_BASE_ANALYSIS}
                config={baseAnalysisJobConfig}
                setConfig={setBaseAnalysisJobConfig}
                toggleCheckbox={toggleCheckbox}
                changeModel={changeModel}
                changeSchedule={changeSchedule}
                changeActivitated={changeActivitated}
                checkedJobs={checkedJobs}
            />
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <JobConfigurator
                title={'Forecast'}
                jobType={JobTypes.JOB_FORECAST}
                config={forecastJobConfig}
                setConfig={setForcastJobConfig}
                toggleCheckbox={toggleCheckbox}
                changeModel={changeModel}
                changeSchedule={changeSchedule}
                changeActivitated={changeActivitated}
                checkedJobs={checkedJobs}
            />
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <JobConfigurator
                title={'Anomaly Detection'}
                jobType={JobTypes.JOB_ANOMALY_DETECT}
                config={anomalyDetectionJobConfig}
                setConfig={setAnomalyDetectionJobConfig}
                toggleCheckbox={toggleCheckbox}
                changeModel={changeModel}
                changeSchedule={changeSchedule}
                changeActivitated={changeActivitated}
                checkedJobs={checkedJobs}
            />
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <JobConfigurator
                title={'Static Rules'}
                jobType={JobTypes.JOB_STATIC_RULES}
                config={staticRulesJobConfig}
                setConfig={setStaticRuleJobConfig}
                toggleCheckbox={toggleCheckbox}
                changeModel={changeModel}
                changeSchedule={changeSchedule}
                changeActivitated={changeActivitated}
                checkedJobs={checkedJobs}
            />
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                    <Button
                        variant="contained"
                        color='primary'
                        onClick={() => {
                            let config = {
                                min_data_points: minDataPoints,
                                job_config: {}
                            };
                            if (baseAnalysisJobConfig) {
                                config.job_config[JobTypes.JOB_BASE_ANALYSIS] = baseAnalysisJobConfig;
                            }
                            if (forecastJobConfig) {
                                config.job_config[JobTypes.JOB_FORECAST] = forecastJobConfig;
                            }
                            if (anomalyDetectionJobConfig) {
                                config.job_config[JobTypes.JOB_ANOMALY_DETECT] = anomalyDetectionJobConfig;
                            }
                            if (staticRulesJobConfig) {
                                config.job_config[JobTypes.JOB_STATIC_RULES] = staticRulesJobConfig;
                            }

                            onSubmit(
                                dialog === 'add' ?
                                    {
                                        name: name,
                                        config: config
                                    } :
                                    {
                                        name: name,
                                        data: {
                                            config: config
                                        }
                                    }
                            );
                        }}
                    >
                        {dialog === 'add' ? 'Add' : 'Edit'}
                    </Button>
                </FormControl>
            </Grid>
        </Grid>
    )
};

export default SerieConfigurator;