import AssessmentIcon from '@material-ui/icons/Assessment';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import DnsIcon from '@material-ui/icons/Dns';
import Drawer from '@material-ui/core/Drawer';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import { HashRouter, NavLink, Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import NetworkPage from "./pages/Network";
import OutputStreamsPage from "./pages/OutputStreams";
import Settings from "./components/Settings";
import TimeSeriesPage from "./pages/TimeSeries";
import { useGlobal, setup_subscriptions } from './store';
import './App.css';

const drawerWidth = 90;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    leftmenubtn: {
        marginLeft: 16,
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        overflow: "hidden"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
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
    },
    sidebar: {
        width: '500px',
        maxWidht: '20vw',
        height: '100vh',
        borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "white",
        padding: "20px"
    }
});

const App = (props) => {
    const [globalState, globalActions] = useGlobal(
        state => null,
        actions => actions
    );
    let [job, _] = useGlobal(
        state => state.job,
        actions => null
    );
    useEffect(() => {
        setup_subscriptions(globalActions);
    }, [globalActions]);

    const { classes } = props;

    if (job === undefined) {
        job = [];
    }

    job.sort((a, b) => { return a.job_id - b.job_id });

    const drawer = (
        <div>
            <div className={`${classes.toolbar} ${classes.logoContainer}`}>
                <img src='assets/icon.png' alt='logo' className={classes.logo} />
            </div>
            <Divider />
            <List>
                <NavLink to="/" exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to="/network" exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><DnsIcon /></ListItemIcon>
                        <ListItemText primary="" />
                    </ListItem>
                </NavLink>
                <NavLink to="/output-streams" exact activeClassName="menu-link-selected">
                    <ListItem button className={classes.leftmenubtn}>
                        <ListItemIcon><ViewStreamIcon /></ListItemIcon>
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
                        <Route exact path='/' component={TimeSeriesPage} />
                        <Route path='/settings/:catid' component={Settings} />
                        <Route path='/settings' component={Settings} />
                        <Route path='/network' component={NetworkPage} />
                        <Route path='/output-streams' component={OutputStreamsPage} />
                    </Switch>

                </main>
                <Hidden smDown>
                    <div className={classes.sidebar}>
                        <div className={classes.toolbar} />
                        <h2>
                            {'Open Jobs'}
                            <Badge badgeContent={job.length} color="primary" style={{ marginLeft: "15px" }}>
                                <WorkOutlineIcon />
                            </Badge>
                        </h2>
                        <div>
                            <List style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}>
                                {job.map((job) => {
                                    return <ListItem button className={classes.leftmenubtn} key={job.job_id}>
                                        <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                                        <ListItemText class="job-item" primary={job.series_name} secondary={job.job_type} />
                                    </ListItem>
                                })}
                            </List>
                        </div>
                    </div>
                </Hidden>
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
