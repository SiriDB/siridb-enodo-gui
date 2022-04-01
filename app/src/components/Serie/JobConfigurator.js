import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { Fragment } from "react";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import { JobTypes, JobScheduleTypes } from "../../constants/enums";

function JobConfigurator({
  models,
  config,
  setConfig,
  disabled,
  removeConfig,
  title,
}) {
  const jobType = config.job_type;

  const changeJobName = (event) => {
    setConfig({ ...config, config_name: event.target.value });
  };

  const toggleJobType = (event) => {
    const cleanConfig = {
      activated: true,
      config_name: config.config_name,
      job_schedule: 200,
      job_schedule_type: null,
      job_type: event.target.value,
      model: null,
      model_params: {},
      requires_job: config.requires_job,
    };
    setConfig(cleanConfig);
  };

  const changeRequiresJob = (event) => {
    const value = event.target.value === "" ? null : event.target.value;
    setConfig({ ...config, requires_job: value });
  };

  const changeActivitated = (event) => {
    const value = event.target.checked;
    setConfig({ ...config, activated: value });
  };

  const changeModel = (event) => {
    const value = event.target.value ? event.target.value : null;
    setConfig({ ...config, model: value });
  };

  const changeScheduleType = (event) => {
    setConfig({ ...config, job_schedule_type: event.target.value });
  };

  const changeSchedule = (event) => {
    const value = Number(event.target.value);
    setConfig({ ...config, job_schedule: value });
  };

  const filteredModels = models.filter((m) =>
    m.supported_jobs.includes(jobType)
  );

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontWeight: "medium" }}>{title}</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={removeConfig} disabled={disabled}>
              <DeleteIcon color={!disabled ? "error" : "disabled"} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <FormControl required error={config.config_name === ""} fullWidth>
          <FormLabel>{"Name"}</FormLabel>
          <TextField
            placeholder="Some logical name"
            variant="outlined"
            defaultValue={config.config_name}
            onChange={changeJobName}
            margin="normal"
            type="text"
            disabled={disabled}
            error={config.config_name === ""}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <FormLabel>{"Requires job"}</FormLabel>
          <TextField
            placeholder="Name of the required job (optional)"
            variant="outlined"
            defaultValue={config.requires_job}
            onChange={changeRequiresJob}
            margin="normal"
            type="text"
            disabled={disabled}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl required error={!config.job_type} disabled={disabled}>
          <FormLabel>{"Type"}</FormLabel>
          <RadioGroup value={config.job_type} onChange={toggleJobType}>
            <FormControlLabel
              value={JobTypes.JOB_BASE_ANALYSIS}
              control={<Radio />}
              label="Base Analysis"
            />
            <FormControlLabel
              value={JobTypes.JOB_FORECAST}
              control={<Radio />}
              label="Forecast"
            />
            <FormControlLabel
              value={JobTypes.JOB_ANOMALY_DETECT}
              control={<Radio />}
              label="Anomaly Detection"
            />
            <FormControlLabel
              value={JobTypes.JOB_STATIC_RULES}
              control={<Radio />}
              label="Static Rules"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {config.job_type && (
        <Fragment>
          <Grid item xs={12} sm={6}>
            <FormControl
              variant="outlined"
              required
              error={!config.model}
              fullWidth
            >
              <FormLabel>{"Model"}</FormLabel>
              <Select
                value={config.model ? config.model : ""}
                onChange={changeModel}
                label={"Model"}
                disabled={disabled}
              >
                <MenuItem value="">
                  <em>{"None"}</em>
                </MenuItem>
                {filteredModels.map((model, i) => (
                  <MenuItem value={model.name} key={i}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              required
              error={config.job_schedule_type === null}
              disabled={disabled}
            >
              <FormLabel>{"Schedule type"}</FormLabel>
              <RadioGroup
                value={config.job_schedule_type}
                onChange={changeScheduleType}
              >
                <FormControlLabel
                  value={JobScheduleTypes.POINTS}
                  control={<Radio />}
                  label="Points"
                />
                <FormControlLabel
                  value={JobScheduleTypes.SECONDS}
                  control={<Radio />}
                  label="Seconds"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl required error={!config.job_schedule}>
              <FormLabel>{"Schedule"}</FormLabel>
              <TextField
                placeholder="No. points/seconds"
                variant="outlined"
                defaultValue={config.job_schedule}
                onChange={changeSchedule}
                type="number"
                name={jobType}
                margin="normal"
                disabled={disabled}
                error={!config.job_schedule}
              />
            </FormControl>
          </Grid>
          {config.model && (
            <Fragment>
              {models
                .find((m) => m.name === config.model)
                .model_arguments.map((argument) => (
                  <Grid item xs={12} sm={6} key={argument.name}>
                    <FormControl
                      fullWidth
                      required={argument.required}
                      error={
                        argument.required && !config.model_params[argument.name]
                      }
                    >
                      <FormLabel>{argument.name}</FormLabel>
                      <TextField
                        placeholder={argument.name}
                        variant="outlined"
                        defaultValue={config.model_params[argument.name]}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            model_params: {
                              ...config.model_params,
                              [argument.name]: Number(e.target.value),
                            },
                          });
                        }}
                        type="number"
                        disabled={disabled}
                        margin="normal"
                        error={
                          argument.required &&
                          !config.model_params[argument.name]
                        }
                      />
                    </FormControl>
                  </Grid>
                ))}
            </Fragment>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.activated}
                  onChange={changeActivitated}
                  name={jobType}
                  color="primary"
                  disabled={disabled}
                />
              }
              label="Activated"
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["models"],
})(JobConfigurator);
