import AssessmentIcon from "@mui/icons-material/Assessment";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
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
import React, { useEffect, useCallback } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import makeStyles from "@mui/styles/makeStyles";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { withVlow } from "vlow";

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
import GlobalStore from "./stores/GlobalStore";
import GlobalActions from "./actions/GlobalActions";
import Fetcher from "./util/Fetcher";

const drawerWidth = 90;

const useStyles = makeStyles((theme) => ({
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
}));

const App = ({ authenticated, socket }) => {
  const classes = useStyles();

  socket.on("update", (data) => {
    const resource = data.resource;
    const resourceData = data.resourceData;
    switch (data.updateType) {
      case "initial":
        GlobalActions.updateStoreValue(resource, resourceData);
        break;
      case "add":
        GlobalActions.updateStoreValue(resource, resourceData, true);
        break;
      case "update":
        GlobalActions.updateStoreResourceItem(
          resource,
          resourceData.rid,
          resourceData
        );
        break;
      case "delete":
        GlobalActions.deleteStoreResourceItem(resource, resourceData);
        break;
      default:
        break;
    }
  });

  const fetchValueFromREST = (path, cb, resourceName) => {
    Fetcher.fetchResource(path, (data) => {
      cb(resourceName, data);
    });
  };

  const setup_subscriptions = useCallback(() => {
    socket.emit("/subscribe/series", {}, (data) => {
      data = JSON.parse(data);
      GlobalActions.updateStoreValue("series", data.data);
    });
    socket.emit("/subscribe/enodo/module", {}, (data) => {
      GlobalActions.updateStoreValue("modules", data.data.modules);
    });
    socket.emit("/subscribe/queue", {}, (data) => {
      data = JSON.parse(data);
      GlobalActions.updateStoreValue("job", data.data);
    });
    socket.emit("/subscribe/event/output", {}, (data) => {
      GlobalActions.updateStoreValue("event_outputs", data.data);
    });
    socket.emit("/subscribe/siridb/status", {}, (data) => {
      GlobalActions.updateStoreValue("siridb_status", data);
    });
    setInterval(() => {
      fetchValueFromREST(
        "/enodo/status",
        GlobalActions.updateStoreValue,
        "enodo_status"
      );
      fetchValueFromREST(
        "/enodo/clients",
        GlobalActions.updateStoreValue,
        "enodo_clients"
      );
    }, 3000);
  }, [socket]);

  useEffect(() => {
    if (authenticated === null) {
      // Get the saved credentials from sessionStorage.
      const username = window.sessionStorage.getItem("username");
      const password = window.sessionStorage.getItem("password");
      if (username && password) {
        socket.emit(
          "authorize",
          { username: username, password: password },
          (data) => {
            if (data === true) {
              setup_subscriptions();
              GlobalActions.updateStoreValue("authenticated", true);
            }
          }
        );
      } else {
        GlobalActions.updateStoreValue("authenticated", false);
      }
    }
  }, [setup_subscriptions, socket, authenticated]);

  const onSignOut = () => {
    // Remove all saved data from sessionStorage
    window.sessionStorage.clear();
    GlobalActions.updateStoreValue("authenticated", false);
  };

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

  if (authenticated === null) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#fff" }}>
          <CircularProgress size={80}/>
        </Box>
    );
  } else if (authenticated === false) {
    return (
      <div className={classes.root}>
        <SignInPage />
      </div>
    );
  } else {
    return (
      <HashRouter>
        <div className={classes.root}>
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
        </div>
      </HashRouter>
    );
  }
};

export default withVlow(GlobalStore)(App);
