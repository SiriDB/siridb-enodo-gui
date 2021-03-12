import AssessmentIcon from '@material-ui/icons/Assessment';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import DnsIcon from '@material-ui/icons/Dns';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import WorkOffIcon from '@material-ui/icons/WorkOff';
import { HashRouter, NavLink, Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import './App.css';
import * as ROUTES from './constants/routes';
import DashboardPage from './pages/Dashboard';
import FailedJobsPage from "./pages/FailedJobs";
import NetworkPage from "./pages/Network";
import OutputStreamsPage from "./pages/OutputStreams";
import SettingsPage from "./pages/Settings";
import TimeSeriesPage from "./pages/TimeSeries";
import { useGlobal, setup_subscriptions } from './store';

const drawerWidth = 90;

const styles = theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    leftmenubtn: {
        marginLeft: theme.spacing(2)
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        overflow: "hidden"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 64,
        height: '100%',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    }
});

const App = (props) => {
    const [, globalActions] = useGlobal(
        state => null,
        actions => actions
    );
    useEffect(() => {
        setup_subscriptions(globalActions);
    }, [globalActions]);

    const { classes } = props;

    const drawer = (
        <div>
            <div className={`${classes.toolbar} ${classes.logoContainer}`}>
                <img src='assets/icon.png' alt='logo' className={classes.logo} />
            </div>
            <Divider />
            <List>
                <NavLink to={ROUTES.LANDING} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to={ROUTES.TIME_SERIES} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to={ROUTES.NETWORK} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><DnsIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to={ROUTES.OUTPUT_STREAMS} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><ViewStreamIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to={ROUTES.SETTINGS} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to={ROUTES.FAILED_JOBS} exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><WorkOffIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
            </List>
        </div>
    );

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

                    <Switch>
                        <Route exact path={ROUTES.LANDING} component={DashboardPage} />
                        <Route exact path={ROUTES.TIME_SERIES} component={TimeSeriesPage} />
                        <Route path={ROUTES.NETWORK} component={NetworkPage} />
                        <Route path={ROUTES.OUTPUT_STREAMS} component={OutputStreamsPage} />
                        <Route path={ROUTES.SETTINGS} component={SettingsPage} />
                        <Route path={ROUTES.FAILED_JOBS} component={FailedJobsPage} />
                    </Switch>

                </main>
            </div>
        </HashRouter>
    )
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
