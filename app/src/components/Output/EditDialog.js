import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { withVlow } from "vlow";

import Configurator from "./Configurator";
import GlobalStore from "../../stores/GlobalStore";

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

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(4),
    backgroundColor: "#f0f0f0",
  },
}));

function EditDialog({
  socket,
  open,
  handleClose,
  onSubmit,
  currentOutputStream,
}) {
  const classes = useStyles();

  const [vendorName] = useState(currentOutputStream.data.vendor_name);

  const closeDialog = () => {
    handleClose();
  };

  const handleUpdateOutputStream = (data) => {
    const outputStream = {
      id: currentOutputStream.data.rid,
      data: data,
    };

    socket.emit(`/api/event/output/update`, outputStream, () => {
      onSubmit();
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
      <DialogTitle id="alert-dialog-title">{"Edit output stream"}</DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Configurator
          vendorName={vendorName}
          outputTypeProperties={outputTypeProperties[vendorName]}
          onSave={handleUpdateOutputStream}
          variant="edit"
          existingData={currentOutputStream.data}
        />
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
})(EditDialog);
