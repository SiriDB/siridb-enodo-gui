import AddCircleIcon from "@mui/icons-material/AddCircle";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MobileStepper from "@mui/material/MobileStepper";
import React, { useState, Fragment } from "react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material/styles";

import JobConfigurator from "./JobConfigurator";

const useStyles = makeStyles(() => ({
  stepper: {
    backgroundColor: "#fff",
  },
}));

const DialogTypes = {
  ADD: "add",
  EDIT: "edit",
  ADD_LABEL: "addLabel",
  INFO_LABEL: "infoLabel",
};

const defaulConfig = {
  activated: true,
  config_name: "",
  job_schedule: 200,
  job_schedule_type: null,
  job_type: null,
  model: null,
  model_params: {},
  requires_job: null
};

function SerieConfigurator({
  title,
  dialog,
  onSubmit,
  onClose,
  currentConfig,
  socketError,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  const existingConfig =
    dialog === DialogTypes.EDIT || dialog === DialogTypes.INFO_LABEL;

  // Config

  // Name
  const [name, setName] = useState(existingConfig ? currentConfig.name : "");

  // Label description. Only used for configuring labels.
  const [labelDescription, setLabelDescription] = useState(
    dialog === DialogTypes.INFO_LABEL ? currentConfig.description : ""
  );

  // Min no. data points
  const [minDataPoints, setMinDataPoints] = useState(
    existingConfig ? currentConfig.config.min_data_points : 2
  );

  // Realtime analysis
  const [realtime, setRealtime] = useState(
    existingConfig ? currentConfig.config.realtime : false
  );

  const [jobConfigs, setJobConfigs] = useState(
    existingConfig && currentConfig.config.job_config
      ? currentConfig.config.job_config
      : [defaulConfig]
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateConfig = (newConfig, index) => {
    let newArr = [...jobConfigs];
    newArr[index] = newConfig;

    setJobConfigs(newArr);
  };

  const addConfig = () => {
    let newArr = [...jobConfigs];
    newArr.push(defaulConfig);
    setJobConfigs(newArr);
  };

  const removeConfig = (index) => {
    let newArr = [...jobConfigs];
    newArr.splice(index, 1);
    setJobConfigs(newArr);
  };

  const addVariant =
    dialog === DialogTypes.ADD || dialog === DialogTypes.ADD_LABEL;
  const infoVariant = dialog === DialogTypes.INFO_LABEL;

  const aboutSeries = dialog === DialogTypes.ADD || dialog === DialogTypes.EDIT;
  const aboutLabels =
    dialog === DialogTypes.ADD_LABEL || dialog === DialogTypes.INFO_LABEL;

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {activeStep === 0 ? (
            <Fragment>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="h6" color="primary">
                    {"General"}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required error={name === ""}>
                  <FormLabel>
                    {aboutSeries ? "Series name" : "Label name (SiriDB Group)"}
                  </FormLabel>
                  <TextField
                    placeholder={
                      aboutSeries ? "Series name" : "Label name (SiriDB Group)"
                    }
                    variant="outlined"
                    defaultValue={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    disabled={existingConfig}
                    margin="normal"
                    error={name === ""}
                  />
                </FormControl>
              </Grid>
              {aboutLabels ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>{"Description"}</FormLabel>
                    <TextField
                      placeholder="Description"
                      variant="outlined"
                      defaultValue={labelDescription}
                      onChange={(e) => {
                        setLabelDescription(e.target.value);
                      }}
                      disabled={infoVariant}
                      margin="normal"
                    />
                  </FormControl>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <FormControl fullWidth required error={!minDataPoints}>
                  <FormLabel>{"Min. Data points"}</FormLabel>
                  <TextField
                    placeholder="Min. Data points"
                    variant="outlined"
                    defaultValue={minDataPoints}
                    onChange={(e) => {
                      setMinDataPoints(Number(e.target.value));
                    }}
                    type="number"
                    disabled={infoVariant}
                    margin="normal"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={realtime}
                      onChange={(e) => {
                        setRealtime(e.target.checked);
                      }}
                      color="primary"
                      disabled={infoVariant}
                    />
                  }
                  label="Real-time analysis"
                />
              </Grid>
              {realtime && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    {
                      "Enabling real-time analysis can have a negative impact on the performance of the system."
                    }
                  </Alert>
                </Grid>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <Grid container item xs={12} justifyContent="space-between">
                <Typography variant="h6" color="primary">
                  {"Jobs"}
                </Typography>
                <IconButton onClick={addConfig} disabled={infoVariant}>
                  <AddCircleIcon color={!infoVariant ? "primary" : "disabled"} />
                </IconButton>
              </Grid>
              {jobConfigs.map((jobConfig, i) => (
                <React.Fragment key={i}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <JobConfigurator
                    config={jobConfig}
                    setConfig={(c) => updateConfig(c, i)}
                    disabled={infoVariant}
                    removeConfig={() => removeConfig(i)}
                    title={
                      jobConfig.config_name
                        ? jobConfig.config_name
                        : `Job ${i + 1}`
                    }
                  />
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {infoVariant && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    {
                      "When series are added by making use of labels, it is not possible to adjust the configuration of these series afterwards."
                    }
                  </Alert>
                </Grid>
              )}
            </Fragment>
          )}
          <Grid item xs={12}>
            <MobileStepper
              steps={2}
              position="static"
              variant="dots"
              activeStep={activeStep}
              className={classes.stepper}
              nextButton={
                activeStep === 0 ? (
                  <Button size="small" onClick={handleNext}>
                    {"Next"}
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    style={{ visibility: infoVariant ? "hidden" : null }}
                    onClick={() => {
                      let config = {
                        min_data_points: minDataPoints,
                        realtime: realtime,
                        job_config: jobConfigs,
                      };

                      onSubmit(
                        dialog === DialogTypes.ADD
                          ? {
                              name: name,
                              config: config,
                            }
                          : dialog === DialogTypes.EDIT
                          ? {
                              name: name,
                              data: {
                                config: config,
                              },
                            }
                          : {
                              name: name,
                              description: labelDescription,
                              series_config: config,
                            }
                      );
                    }}
                  >
                    {addVariant ? "Add" : "Edit"}
                  </Button>
                )
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  style={{ visibility: activeStep === 0 ? "hidden" : null }}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  {"Back"}
                </Button>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      {socketError && <Alert severity="error">{socketError}</Alert>}
      <DialogActions>
        <Button onClick={onClose} color="inherit">{"Close"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SerieConfigurator;
