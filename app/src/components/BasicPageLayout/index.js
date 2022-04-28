import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import WorkIcon from "@mui/icons-material/Work";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import makeStyles from "@mui/styles/makeStyles";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  sidebar: {
    width: 350,
    maxWidht: "20vw",
    padding: theme.spacing(3),
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
}));

const BasicPageLayout = ({
  socket,
  title,
  buttonAction,
  buttonText,
  hideJobDrawer,
  titleButton,
  children,
}) => {
  const classes = useStyles();

  const [stats, setStats] = useState(null);

  const retrieveInfo = useCallback(() => {
    socket.emit("/api/enodo/stats", {}, (data) => {
      setStats(data.data);
    });
  }, [socket]);

  useEffect(() => {
    retrieveInfo();
  }, [retrieveInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      retrieveInfo();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [retrieveInfo]);

  return (
    <Grid container>
      <Grid item style={{ flex: 1 }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Typography variant="h4">{title}</Typography>
                  </Grid>
                  {titleButton ? <Grid item>{titleButton}</Grid> : null}
                </Grid>
              </Grid>
              <Grid>
                {buttonAction && buttonText && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={buttonAction}
                  >
                    {buttonText}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>{children}</Grid>
        </Grid>
      </Grid>
      {!hideJobDrawer && (
        <Hidden lgDown>
          <Grid item>
            <Drawer
              variant="permanent"
              open
              className={classes.sidebar}
              classes={{
                paper: classes.sidebar,
              }}
              anchor="right"
            >
              <div className={classes.toolbar} />
              <Typography variant="h4" gutterBottom className={classes.title}>
                {"Jobs"}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {"Open"}
                <Badge
                  badgeContent={stats ? stats.no_open_jobs : null}
                  color="primary"
                  style={{ marginLeft: 12 }}
                >
                  <WorkOutlineIcon />
                </Badge>
              </Typography>
              <Typography>
                {`Currently there are ${
                  stats ? stats.no_open_jobs : 0
                } jobs waiting to be picked-up by a worker.`}
              </Typography>
              <Divider className={classes.divider} />
              <Typography variant="h6" gutterBottom>
                {"Active"}
                <Badge
                  badgeContent={stats ? stats.no_active_jobs : null}
                  color="primary"
                  style={{ marginLeft: 12 }}
                >
                  <WorkIcon />
                </Badge>
              </Typography>
              <Typography>
                {`Currently there are ${
                  stats ? stats.no_active_jobs : 0
                } jobs being processed by a worker.`}
              </Typography>
              <Divider className={classes.divider} />
              <Typography variant="h6" gutterBottom>
                {"Failed"}
                <Badge
                  badgeContent={stats ? stats.no_failed_jobs : null}
                  color="primary"
                  style={{ marginLeft: 12 }}
                >
                  <WorkOffIcon />
                </Badge>
              </Typography>
              <Typography>
                {`Currently there are ${
                  stats ? stats.no_failed_jobs : 0
                } failed jobs.`}
              </Typography>
            </Drawer>
          </Grid>
        </Hidden>
      )}
    </Grid>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(BasicPageLayout);
