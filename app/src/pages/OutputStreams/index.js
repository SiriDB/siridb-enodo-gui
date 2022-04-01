import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List/List";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect, useCallback } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { withVlow } from "vlow";

import BasicPageLayout from "../../components/BasicPageLayout";
import EditDialog from "../../components/Output/EditDialog";
import GlobalStore from "../../stores/GlobalStore";
import InfoOutputDialog from "../../components/Output/Info";
import OutputDialog from "../../components/Output/Dialog";
import { VendorNames } from "../../constants/enums";

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: 93,
    display: "flex",
    alignItems: "center",
  },
}));

const OutputStreamsPage = ({ socket }) => {
  const classes = useStyles();
  const [outputStreams, setOutputStreams] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [currentOutput, setCurrentOutput] = useState(null);

  const retrieveOutputStreams = useCallback(() => {
    socket.emit("/api/event/output", {}, (data) => {
      setOutputStreams(data.data);
    });
  }, [socket]);

  useEffect(() => {
    retrieveOutputStreams();
  }, [retrieveOutputStreams]);

  useEffect(() => {
    const interval = setInterval(() => {
      retrieveOutputStreams();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [retrieveOutputStreams]);

  const handleClickOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleClickOpenInfoDialog = (output) => {
    setCurrentOutput(output);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setCurrentOutput(null);
  };

  const handleClickOpenEditDialog = (output) => {
    setCurrentOutput(output);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentOutput(null);
  };

  const handleSubmit = () => {
    retrieveOutputStreams();
    handleCloseAddDialog();
    handleCloseEditDialog();
  };

  const deleteOutput = (rid) => {
    var data = { output_id: rid };
    socket.emit(`/api/event/output/delete`, data, () => {
      const array = outputStreams.filter((obj) => {
        return obj.data.rid !== rid;
      });
      setOutputStreams(array);
    });
  };

  return (
    <BasicPageLayout
      title="Output streams"
      buttonText="Add"
      buttonAction={() => handleClickOpenAddDialog()}
    >
      <List style={{ maxHeight: "calc(100vh - 200px)" }}>
        {outputStreams.length < 1 ? (
          <div className="centered-message">No output streams found</div>
        ) : (
          ""
        )}
        {outputStreams && (
          <Grid container direction="column" spacing={2}>
            {outputStreams.map((output) => {
              return (
                <Grid item key={output.data.rid}>
                  <Paper className={classes.paper}>
                    <div style={{ padding: "10px 0", flex: 1 }}>
                      <ListItem>
                        <ListItemAvatar>
                          <img
                            alt={`Avatar ${output.data.vendor_name}`}
                            src={`assets/${
                              output.data.vendor_name === VendorNames.SLACK
                                ? "slack_logo"
                                : output.data.vendor_name ===
                                  VendorNames.MS_TEAMS
                                ? "ms_teams_logo"
                                : output.data.vendor_name ===
                                  VendorNames.DUTYCALLS
                                ? "dc-icon-red"
                                : output.data.vendor_name === VendorNames.SENTRY
                                ? "sentry-glyph-dark-400x367"
                                : "webhooks"
                            }.png`}
                            style={{ width: 32 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={output.data.custom_name}
                          secondary={
                            "Vendor: " +
                            (output.data.vendor_name === VendorNames.SLACK
                              ? "Slack"
                              : output.data.vendor_name === VendorNames.MS_TEAMS
                              ? "Microsoft Teams"
                              : output.data.vendor_name ===
                                VendorNames.DUTYCALLS
                              ? "DutyCalls"
                              : output.data.vendor_name === VendorNames.SENTRY
                              ? "Sentry"
                              : "Webhook")
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="Show info"
                            onClick={() => handleClickOpenInfoDialog(output)}
                            size="large"
                          >
                            <InfoIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Edit"
                            onClick={() => handleClickOpenEditDialog(output)}
                            size="large"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Delete"
                            onClick={() => deleteOutput(output.data.rid)}
                            size="large"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </List>
      <OutputDialog
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        onSubmit={handleSubmit}
      />
      {currentOutput && (
        <EditDialog
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          onSubmit={handleSubmit}
          currentOutputStream={currentOutput}
        />
      )}
      {currentOutput && (
        <InfoOutputDialog
          open={openInfoDialog}
          handleClose={handleCloseInfoDialog}
          output={currentOutput}
        />
      )}
    </BasicPageLayout>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(OutputStreamsPage);
