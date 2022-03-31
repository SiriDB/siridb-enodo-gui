import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Link from "@mui/material/Link";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';

import EnterCustomName from "./EnterCustomName";
import EnterDutyCallsChannels from "./EnterDutyCallsChannels";
import EnterDutyCallsCredentials from "./EnterDutyCallsCredentials";
import EnterHeaders from "./EnterHeaders";
import EnterPayload from "./EnterPayload";
import EnterSentryCredentials from "./EnterSentryCredentials";
import EnterUrl from "./EnterUrl";
import SelectEventTypes from "./SelectEventTypes";
import SelectSeverity from "./SelectSeverity";
import { VendorNames } from "../../constants/enums";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 75,
  },
  paperContent: {
    padding: theme.spacing(4),
    height: 340,
  },
  textField: {
    width: 500,
  },
  stepper: {
    backgroundColor: "#fff",
  },
}));

export default function Configurator({
  vendorName,
  outputTypeProperties,
  onSave,
  variant,
  onGoBack,
  existingData,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [forSeverity, setForSeverity] = useState(
    existingData ? existingData.severity : null
  );
  const [url, setUrl] = useState(existingData ? existingData.url : "");
  const [headers, setHeaders] = useState(
    existingData ? existingData.headers : {}
  );
  const [payload, setPayload] = useState(
    existingData
      ? existingData.payload
      : vendorName !== VendorNames.SENTRY
      ? '{\n  "title": "{{event.title}}",\n  "body": "{{event.message}}",\n  "dateTime": {{event.ts}},\n  "severity": "{{severity}}"\n}' // eslint-disable-line
      : '{\n  "message": "{{event.title}}",\n  "transaction": "{{event.message}}",\n  "timestamp": {{event.ts}},\n  "level": "{{severity}}",\n  "event_id": "{{event.uuid}}",\n  "platform": "other"\n}' // eslint-disable-line
  );
  const [eventTypes, setEventTypes] = useState(
    existingData ? existingData.for_event_types : []
  );
  const [customName, setCustomName] = useState(
    existingData ? existingData.custom_name : ""
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitForm = () => {
    const data = {
      severity: forSeverity,
      url: url,
      headers: headers,
      payload: payload,
      for_event_types: eventTypes,
      custom_name: customName,
      vendor_name: vendorName,
    };
    onSave(data);
  };

  return (
    <Grid container spacing={4} className={classes.root}>
      <Grid item xs={12}>
        <Grid container>
          {variant === "add" ? (
            <Grid item xs={2}>
              <IconButton onClick={onGoBack} size="large">
                <ArrowBackIcon size="small" />
              </IconButton>
            </Grid>
          ) : null}
          <Grid item xs={2}>
            <img
              className={classes.media}
              src={outputTypeProperties.image}
              alt="Output type"
            />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">{outputTypeProperties.name}</Typography>
            <Typography variant="caption">
              {outputTypeProperties.description}
              {outputTypeProperties.link && " "}
              {outputTypeProperties.link && (
                <Link
                  href={outputTypeProperties.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {outputTypeProperties.link}
                </Link>
              )}
              {outputTypeProperties.link && "."}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <div className={classes.paperContent}>
            {vendorName === VendorNames.WEBHOOK && (
              <React.Fragment>
                {activeStep === 0 ? (
                  <EnterCustomName name={customName} setName={setCustomName} />
                ) : activeStep === 1 ? (
                  <SelectEventTypes
                    eventTypes={eventTypes}
                    setEventTypes={setEventTypes}
                  />
                ) : activeStep === 2 ? (
                  <SelectSeverity
                    severity={forSeverity}
                    setSeverity={setForSeverity}
                  />
                ) : activeStep === 3 ? (
                  <EnterUrl url={url} setUrl={setUrl} />
                ) : activeStep === 4 ? (
                  <EnterHeaders headers={headers} setHeaders={setHeaders} />
                ) : (
                  <EnterPayload payload={payload} setPayload={setPayload} />
                )}
              </React.Fragment>
            )}
            {vendorName === VendorNames.SLACK && (
              <React.Fragment>
                {activeStep === 0 ? (
                  <EnterCustomName name={customName} setName={setCustomName} />
                ) : activeStep === 1 ? (
                  <SelectEventTypes
                    eventTypes={eventTypes}
                    setEventTypes={setEventTypes}
                  />
                ) : activeStep === 2 ? (
                  <SelectSeverity
                    severity={forSeverity}
                    setSeverity={setForSeverity}
                  />
                ) : activeStep === 3 ? (
                  <EnterUrl url={url} setUrl={setUrl} />
                ) : (
                  <EnterPayload payload={payload} setPayload={setPayload} />
                )}
              </React.Fragment>
            )}
            {vendorName === VendorNames.MS_TEAMS && (
              <React.Fragment>
                {activeStep === 0 ? (
                  <EnterCustomName name={customName} setName={setCustomName} />
                ) : activeStep === 1 ? (
                  <SelectEventTypes
                    eventTypes={eventTypes}
                    setEventTypes={setEventTypes}
                  />
                ) : activeStep === 2 ? (
                  <SelectSeverity
                    severity={forSeverity}
                    setSeverity={setForSeverity}
                  />
                ) : activeStep === 3 ? (
                  <EnterUrl url={url} setUrl={setUrl} />
                ) : (
                  <EnterPayload payload={payload} setPayload={setPayload} />
                )}
              </React.Fragment>
            )}
            {vendorName === VendorNames.DUTYCALLS && (
              <React.Fragment>
                {activeStep === 0 ? (
                  <EnterCustomName name={customName} setName={setCustomName} />
                ) : activeStep === 1 ? (
                  <SelectEventTypes
                    eventTypes={eventTypes}
                    setEventTypes={setEventTypes}
                  />
                ) : activeStep === 2 ? (
                  <SelectSeverity
                    severity={forSeverity}
                    setSeverity={setForSeverity}
                  />
                ) : activeStep === 3 ? (
                  <EnterDutyCallsCredentials setHeaders={setHeaders} />
                ) : activeStep === 4 ? (
                  <EnterDutyCallsChannels setUrl={setUrl} />
                ) : (
                  <EnterPayload payload={payload} setPayload={setPayload} />
                )}
              </React.Fragment>
            )}
            {vendorName === VendorNames.SENTRY && (
              <React.Fragment>
                {activeStep === 0 ? (
                  <EnterCustomName name={customName} setName={setCustomName} />
                ) : activeStep === 1 ? (
                  <SelectEventTypes
                    eventTypes={eventTypes}
                    setEventTypes={setEventTypes}
                  />
                ) : activeStep === 2 ? (
                  <SelectSeverity
                    severity={forSeverity}
                    setSeverity={setForSeverity}
                  />
                ) : activeStep === 3 ? (
                  <EnterSentryCredentials setUrl={setUrl} />
                ) : (
                  <EnterPayload
                    payload={payload}
                    setPayload={setPayload}
                    addAdvancedButton
                  />
                )}
              </React.Fragment>
            )}
          </div>
          <MobileStepper
            steps={outputTypeProperties.noSteps}
            position="static"
            variant="dots"
            activeStep={activeStep}
            className={classes.stepper}
            nextButton={
              activeStep !== outputTypeProperties.noSteps - 1 ? (
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === outputTypeProperties.noSteps - 1}
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
                  variant="contained"
                  disableElevation
                  color="primary"
                  onClick={submitForm}
                  disabled={activeStep !== outputTypeProperties.noSteps - 1}
                >
                  {variant === "add" ? "Add" : "Save"}
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
        </Paper>
      </Grid>
    </Grid>
  );
}
