import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { withVlow } from "vlow";

import Configurator from "./Configurator";
import GlobalStore from "../../stores/GlobalStore";
import { VendorNames, EventOutputTypes } from "../../constants/enums";

const outputTypeProperties = {
  webhook: {
    name: "Generic Webhook",
    image: "assets/webhooks.png",
    noSteps: 6,
    description: "Output events to a desired webhook URL.",
    link: null,
  },
  slack: {
    name: "Slack",
    image: "assets/slack_logo.png",
    noSteps: 5,
    description:
      "Output events to a desired Slack channel. A prerequisite for this configuration is that you have completed the following tutorial:",
    link: "https://api.slack.com/messaging/webhooks",
  },
  ms_teams: {
    name: "Microsoft Teams",
    image: "assets/ms_teams_logo.png",
    noSteps: 5,
    description:
      "Output events to a desired Microsoft Teams channel. A prerequisite for this configuration is that you have completed the following tutorial:",
    link: "https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook",
  },
  dutycalls: {
    name: "DutyCalls",
    image: "assets/dc-icon-red.png",
    noSteps: 6,
    description:
      "Output events to a desired DutyCalls channel. A prerequisite for this configuration is that you have completed the following tutorial:",
    link: "https://docs.dutycalls.me/getting-started/",
  },
  sentry: {
    name: "Sentry",
    image: "assets/sentry-glyph-dark-400x367.png",
    noSteps: 5,
    description:
      "Output events to a desired Sentry project. A prerequisite for this configuration is that you have completed the following tutorial:",
    link: "https://docs.sentry.io/product/integrations/integration-platform/#internal-integrations",
  },
};

const useStyles1 = makeStyles({
  root: {
    width: 250,
  },
  media: {
    height: 125,
    backgroundSize: 70,
    backgroundPosition: "center",
    backgroundColor: "#e8f7f6",
  },
});

function OutputTypeCard({ name, image, onClick }) {
  const classes = useStyles1();
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          className={classes.media}
          image={image}
          title="Output type image"
        />
        <Divider />
        <CardContent>
          <Typography gutterBottom align="center" variant="h6">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const useStyles2 = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(4),
    backgroundColor: "#f0f0f0",
  },
}));

function OutputDialog({ socket, open, handleClose, onSubmit }) {
  const classes = useStyles2();

  const [vendorName, setVendorName] = useState(null);

  const resetVendorName = () => {
    setVendorName(null);
  };

  const closeDialog = () => {
    handleClose();
    resetVendorName();
  };

  const handleAddOutputStream = (data) => {
    const outputStream = {
      output_type: EventOutputTypes.ENODO_EVENT_OUTPUT_WEBHOOK,
      data: data,
    };
    socket.emit(`/api/event/output/create`, outputStream, () => {
      onSubmit();
      resetVendorName();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">{"Add output stream"}</DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        {vendorName === null ? (
          <React.Fragment>
            <DialogContentText id="alert-dialog-description" gutterBottom>
              {"Select the output type you want to add."}
            </DialogContentText>
            <Grid container spacing={4} justifyContent="flex-start">
              <Grid item xs={4}>
                <OutputTypeCard
                  name={outputTypeProperties[VendorNames.SLACK].name}
                  image={outputTypeProperties[VendorNames.SLACK].image}
                  onClick={() => setVendorName(VendorNames.SLACK)}
                />
              </Grid>
              <Grid item xs={4}>
                <OutputTypeCard
                  name={outputTypeProperties[VendorNames.MS_TEAMS].name}
                  image={outputTypeProperties[VendorNames.MS_TEAMS].image}
                  onClick={() => setVendorName(VendorNames.MS_TEAMS)}
                />
              </Grid>
              <Grid item xs={4}>
                <OutputTypeCard
                  name={outputTypeProperties[VendorNames.DUTYCALLS].name}
                  image={outputTypeProperties[VendorNames.DUTYCALLS].image}
                  onClick={() => setVendorName(VendorNames.DUTYCALLS)}
                />
              </Grid>
              <Grid item xs={4}>
                <OutputTypeCard
                  name={outputTypeProperties[VendorNames.SENTRY].name}
                  image={outputTypeProperties[VendorNames.SENTRY].image}
                  onClick={() => setVendorName(VendorNames.SENTRY)}
                />
              </Grid>
              <Grid item xs={4}>
                <OutputTypeCard
                  name={outputTypeProperties[VendorNames.WEBHOOK].name}
                  image={outputTypeProperties[VendorNames.WEBHOOK].image}
                  onClick={() => setVendorName(VendorNames.WEBHOOK)}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <Configurator
            vendorName={vendorName}
            outputTypeProperties={outputTypeProperties[vendorName]}
            onGoBack={resetVendorName}
            onSave={handleAddOutputStream}
            variant="add"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="inherit">
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(OutputDialog);
