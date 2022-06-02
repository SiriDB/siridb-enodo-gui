import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MenuItem from "@mui/material/MenuItem";
import MobileStepper from "@mui/material/MobileStepper";
import React, { useState, Fragment, useEffect } from "react";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material/styles";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";

const useStyles = makeStyles(() => ({
  stepper: {
    backgroundColor: "#fff",
  },
}));

function ResolveDialog({ socket, open, onClose, failedJobs }) {
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  const [seriesNames, setSeriesNames] = useState([]);
  const [seriesName, setSeriesName] = useState(null);
  const [jobTypes, setJobTypes] = useState(null);

  useEffect(() => {
    const sns = [...new Set(failedJobs.map((j) => j.series_name))];
    setSeriesNames(sns);
  }, [failedJobs]);

  useEffect(() => {
    const jts = [
      ...new Set(
        failedJobs
          .filter((j) => j.series_name === seriesName)
          .map((j) => j.job_config.job_type)
      ),
    ];
    setJobTypes(jts);
  }, [failedJobs, seriesName]);

  const changeSeriesName = (event) => {
    const value = event.target.value ? event.target.value : null;
    setSeriesName(value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{"Resolve failed jobs"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {activeStep === 0 ? (
            <Fragment>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2">
                    {
                      "Select the series for which you would like to resolve the failed jobs:"
                    }
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel required error={!seriesName}>
                    {"Series name"}
                  </InputLabel>
                  <Select
                    value={seriesName}
                    onChange={changeSeriesName}
                    label={"Series name"}
                  >
                    <MenuItem value="">
                      <em>{"None"}</em>
                    </MenuItem>
                    {seriesNames.map((sn) => (
                      <MenuItem value={sn} key={sn}>
                        {sn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Fragment>
          ) : (
            <Fragment>
              <Grid item xs={12}>
                <DialogContentText>
                  {`Before continuing, it might be wise to disable ${jobTypes}, for series ${seriesName}, or fix the issue which is resulting in these failed jobs.`}
                </DialogContentText>
              </Grid>
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
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={!seriesName}
                  >
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
                    onClick={() => {
                      socket.emit("/api/job/failed/resolve", {
                        series_name: seriesName,
                      });
                      onClose();
                    }}
                  >
                    {"Confirm"}
                  </Button>
                )
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
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
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {"Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(ResolveDialog);
