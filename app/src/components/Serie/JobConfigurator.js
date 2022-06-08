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
  modules,
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
      silenced: false,
      config_name: config.config_name,
      job_schedule: 200,
      max_n_points: null,
      job_schedule_type: null,
      job_type: event.target.value,
      module: null,
      module_params: {},
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

  const changeSilenced = (event) => {
    const value = event.target.checked;
    setConfig({ ...config, silenced: value });
  };

  const changeModule = (event) => {
    const value = event.target.value ? event.target.value : null;
    setConfig({ ...config, module: value });
  };

  const changeScheduleType = (event) => {
    setConfig({ ...config, job_schedule_type: event.target.value });
  };

  const changeSchedule = (event) => {
    const value = Number(event.target.value);
    setConfig({ ...config, job_schedule: value });
  };

  const changeMaximumNumberOfPoints = (event) => {
    const value = event.target.value ? Number(event.target.value) : null;
    setConfig({ ...config, max_n_points: value });
  };

  const filteredModules = modules.filter((m) =>
    m.supported_jobs.includes(jobType)
  );

  console.log(config);

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
              error={!config.module}
              fullWidth
            >
              <FormLabel>{"Module"}</FormLabel>
              <Select
                value={config.module ? config.module : ""}
                onChange={changeModule}
                label={"Module"}
                disabled={disabled}
              >
                <MenuItem value="">
                  <em>{"None"}</em>
                </MenuItem>
                {filteredModules.map((module, i) => (
                  <MenuItem value={module.name + "@" + module.version} key={i}>
                    {module.name}
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
                  value={JobScheduleTypes.TIME}
                  control={<Radio />}
                  label="Seconds/milliseconds"
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
                margin="normal"
                disabled={disabled}
                error={!config.job_schedule}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel>{"Max no. points"}</FormLabel>
              <TextField
                placeholder="No. points/seconds"
                variant="outlined"
                defaultValue={config.max_n_points}
                onChange={changeMaximumNumberOfPoints}
                type="number"
                margin="normal"
                disabled={disabled}
              />
            </FormControl>
          </Grid>
          {config.module && (
            <Fragment>
              {modules
                .find((m) => config.module.startsWith(m.name))
                .module_arguments.map((argument) => (
                  <Grid item xs={12} sm={6} key={argument.name}>
                    <FormControl
                      fullWidth
                      required={argument.required}
                      error={
                        argument.required &&
                        (config.module_params[argument.name] == null || !config.module_params.hasOwnProperty(argument.name))
                      }
                    >
                      <FormLabel>{argument.name}</FormLabel>
                      {argument.value_type === "bool" ?
                        <Select
                          displayEmpty
                          defaultValue={config.module_params[argument.name]}
                          label={argument.name}
                          disabled={disabled}
                          margin="dense"
                          error={
                            argument.required &&
                            (config.module_params[argument.name] == null || !config.module_params.hasOwnProperty(argument.name))
                          }
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              module_params: {
                                ...config.module_params,
                                [argument.name]: e.target.value
                              },
                            });
                          }}
                          sx={{ marginTop: 2, marginBottom: 1 }}
                        >
                          <MenuItem value={null}><em>{"None"}</em></MenuItem>
                          <MenuItem value={true}>{"true"}</MenuItem>
                          <MenuItem value={false}>{"false"}</MenuItem>
                        </Select>
                        : <TextField
                          placeholder={argument.name}
                          variant="outlined"
                          defaultValue={config.module_params[argument.name]}
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              module_params: {
                                ...config.module_params,
                                [argument.name]: argument.name === "forecast_name" ? e.target.value : Number(e.target.value),
                              },
                            });
                          }}
                          type={argument.name === "forecast_name" ? "text" : "number"} // TODO: Required till module_params contain data type
                          disabled={disabled}
                          margin="normal"
                          error={
                            argument.required &&
                            (config.module_params[argument.name] == null || !config.module_params.hasOwnProperty(argument.name))
                          }
                        />}
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
                  color="primary"
                  disabled={disabled}
                />
              }
              label="Activated"
            />
          </Grid>
          {jobType !== JobTypes.JOB_BASE_ANALYSIS && <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.silenced}
                  onChange={changeSilenced}
                  color="primary"
                  disabled={disabled}
                />
              }
              label="Silenced"
            />
          </Grid>}
        </Fragment>
      )}
    </Grid>
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["modules"],
})(JobConfigurator);
