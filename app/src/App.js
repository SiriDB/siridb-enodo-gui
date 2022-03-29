import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Divider from "@mui/material/Divider";
import DnsIcon from "@mui/icons-material/Dns";
import Drawer from "@mui/material/Drawer";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LabelIcon from "@mui/icons-material/Label";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import withStyles from "@mui/styles/withStyles";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";

import "./App.css";
import * as ROUTES from "./constants/routes";
import DashboardPage from "./pages/Dashboard";
import FailedJobsPage from "./pages/FailedJobs";
import LabelsPage from "./pages/Labels";
import NetworkPage from "./pages/Network";
import OutputStreamsPage from "./pages/OutputStreams";
import SettingsPage from "./pages/Settings";
import SignInPage from "./pages/SignIn";
import TimeSeriesPage from "./pages/TimeSeries";
import { useGlobal, setup_subscriptions } from "./store";

const drawerWidth = 90;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  leftmenubtn: {
    marginLeft: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  menuLinkSelected: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
});

const App = (props) => {
  const [globalState, globalActions] = useGlobal(
    (state) => state,
    (actions) => actions
  );

  useEffect(() => {
    if (globalState && globalState.authenticated) {
      setup_subscriptions(globalActions);
    }
  }, [globalActions, globalState]);

  useEffect(() => {
    // Get the saved credentials from sessionStorage.
    const username = window.sessionStorage.getItem("username");
    const password = window.sessionStorage.getItem("password");
    globalActions.__updateStoreValue(
      "authenticated",
      username && password ? true : false
    );
  }, [globalActions]);

  const onSignOut = () => {
    // Remove all saved data from sessionStorage
    window.sessionStorage.clear();
    globalActions.__updateStoreValue("authenticated", false);
  };

  const { classes } = props;

  const drawer = (
    <div>
      <div className={`${classes.toolbar} ${classes.logoContainer}`}>
        <img src="assets/icon.png" alt="logo" className={classes.logo} />
      </div>
      <Divider />
      <List>
        <NavLink
          to={ROUTES.LANDING}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.TIME_SERIES}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.LABELS}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.NETWORK}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <DnsIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.OUTPUT_STREAMS}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <ViewStreamIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.FAILED_JOBS}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <WorkOffIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <NavLink
          to={ROUTES.SETTINGS}
          end
          className={({ isActive }) =>
            isActive ? classes.menuLinkSelected : null
          }
        >
          <ListItem button className={classes.leftmenubtn}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
        </NavLink>
        <ListItem button className={classes.leftmenubtn} onClick={onSignOut}>
          <ListItemIcon>
            <ExitToAppIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <HashRouter>
      <div className={classes.root}>
        {globalState && globalState.authenticated ? (
          <React.Fragment>
            <nav className={classes.drawer}>
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </nav>
            <main className={classes.content}>
              <div className={classes.toolbar} />

              <Routes>
                <Route path={ROUTES.LANDING} element={<DashboardPage />} />
                <Route path={ROUTES.TIME_SERIES} element={<TimeSeriesPage />} />
                <Route path={ROUTES.LABELS} element={<LabelsPage />} />
                <Route path={ROUTES.NETWORK} element={<NetworkPage />} />
                <Route
                  path={ROUTES.OUTPUT_STREAMS}
                  element={<OutputStreamsPage />}
                />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.FAILED_JOBS} element={<FailedJobsPage />} />
              </Routes>
            </main>
          </React.Fragment>
        ) : (
          <SignInPage />
        )}
      </div>
    </HashRouter>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
