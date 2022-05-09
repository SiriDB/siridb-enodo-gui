import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { withVlow } from "vlow";

import BasicPageLayout from "../../components/BasicPageLayout";
import GlobalStore from "../../stores/GlobalStore";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
  },
  textField: {
    width: 500,
  },
}));

const OutputStreamsPage = ({ siridb_status, socket }) => {
  const classes = useStyles();
  const [settings, setSettings] = useState(null);
  const [eventSettings, setEventSettings] = useState(null);
  const [analyserSettings, setAnalyserSettings] = useState(null);

  const retrieveSettings = useCallback(() => {
    socket.emit("/api/enodo/settings", {}, (data) => {
      setSettings(data.data);
      setEventSettings(data.data.events);
      setAnalyserSettings(data.data.analyser);
    });
  }, [socket]);

  useEffect(() => {
    retrieveSettings();
  }, [retrieveSettings]);

  const saveSettings = (data) => {
    let tmp_settings = {
      "section": "events",
      "entries": eventSettings
    };
    socket.emit(`/api/enodo/settings/update`, tmp_settings, () => {
      retrieveSettings();
    });
    tmp_settings = {
      "section": "analyser",
      "entries": analyserSettings
    };
    socket.emit(`/api/enodo/settings/update`, tmp_settings, () => {
      retrieveSettings();
    });
  };

  const handleChange = (target, settingsSection) => {
    if (settingsSection === "events") {
      setEventSettings((s) => ({ ...s, [target.name]: target.value }));
    } else if (settingsSection === "analyser") {
      setAnalyserSettings((s) => ({ ...s, [target.name]: target.value }));
    }
  };

  return (
    <BasicPageLayout title="Settings">
      {settings && eventSettings && analyserSettings ? (
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="subtitle2">{"Runtime settings"}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={3}>
                <Grid item xs={6}>
                  <Grid container spacing={3} direction="column">
                    <Grid item>
                      <TextField
                        label="Max queue length before event"
                        placeholder="Max queue length before event"
                        name="max_in_queue_before_warning"
                        onChange={(e) => handleChange(e.target, "events")}
                        variant="outlined"
                        className={classes.textField}
                        type="text"
                        value={eventSettings.max_in_queue_before_warning}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Min data points (used when not specified in series config)"
                        placeholder="Min data points"
                        name="min_data_points"
                        onChange={(e) => handleChange(e.target, "analyser")}
                        variant="outlined"
                        className={classes.textField}
                        type="text"
                        value={analyserSettings.min_data_points}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} style={{ display: "flex" }}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                  >
                    <Grid item>
                      {siridb_status.data_conn ? (
                        <CloudDoneIcon
                          color="primary"
                          style={{ fontSize: 80 }}
                        />
                      ) : (
                        <CloudOffIcon
                          color="disabled"
                          style={{ fontSize: 80 }}
                        />
                      )}
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h6"
                        color={
                          siridb_status.data_conn ? "primary" : "textSecondary"
                        }
                      >
                        {siridb_status.data_conn
                          ? "Connected to SiriDB"
                          : "Not connected to SiriDB"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={3}>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          saveSettings();
                        }}
                      >
                        {"Save"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </BasicPageLayout>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["siridb_status", "socket"],
})(OutputStreamsPage);
