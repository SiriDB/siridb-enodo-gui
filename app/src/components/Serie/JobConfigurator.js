import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { Fragment } from "react";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { JobTypes } from "../../constants/enums";
import { useGlobal } from "../../store";

function JobConfigurator({ config, setConfig, disabled, removeConfig, title }) {
  const [models] = useGlobal((state) => state.enodo_model);

  const jobType = config.job_type;

  const changeJobName = (event) => {
    setConfig({ ...config, link_name: event.target.value });
  };

  const toggleJobType = (event) => {
    const cleanConfig = {
      link_name: config.link_name,
      activated: true,
      job_type: event.target.value,
      model: null,
      job_schedule_type: null,
      job_schedule: 200,
      model_params: {},
    };
    setConfig(cleanConfig);
  };

  const changeActivitated = (event) => {
    const value = event.target.checked;
    setConfig({ ...config, activated: value });
  };

  const changeModel = (event) => {
    const value = event.target.value ? event.target.value : null;
    setConfig({ ...config, model: value });
  };

  const changeSchedule = (event) => {
    const value = Number(event.target.value);
    setConfig({ ...config, job_schedule: value });
  };

  const filteredModels = models.filter((m) => m.supported_jobs.includes(jobType));

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
            <IconButton onClick={removeConfig}>
              <DeleteIcon color="error" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Job name"
          variant="outlined"
          defaultValue={config.link_name}
          onChange={changeJobName}
          required
          error={config.link_name === ""}
          type="text"
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel>{"Job type"}</FormLabel>
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel required error={!config.model}>
                {"Job Model"}
              </InputLabel>
              <Select
                value={config.model ? config.model : ""}
                onChange={changeModel}
                label={"Job Model"}
                name={jobType}
                disabled={disabled}
              >
                <MenuItem value="">
                  <em>{"None"}</em>
                </MenuItem>
                {filteredModels.map((model, i) => 
                  <MenuItem value={model.name} key={i}>
                    {model.name}
                  </MenuItem>
                )}
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
                type="number"
                name={jobType}
                required
                error={!config.job_schedule}
                disabled={disabled}
              />
            </FormControl>
          </Grid>
          {config.model && (
            <Fragment>
              {models
                .find((m) => m.name === config.model)
                .model_arguments.map((argument) => (
                  <Grid item xs={12} sm={6} key={argument.name}>
                    <FormControl fullWidth>
                      <TextField
                        label={argument.name}
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
                        required={argument.required}
                        error={
                          argument.required &&
                          !config.model_params[argument.name]
                        }
                        type="number"
                        disabled={disabled}
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

export default JobConfigurator;
