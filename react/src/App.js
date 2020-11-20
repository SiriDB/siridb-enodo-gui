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
import React, { useEffect, useState } from 'react';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import { HashRouter, NavLink, Route, Switch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

import '../public/style.css';
import Logo from '../public/assets/icon.png';
import NetworkPage from "./pages/Network";
import OutputStreamsPage from "./pages/OutputStreams";
import Settings from "./components/Settings";
import TimeSeriesPage from "./pages/TimeSeries";
import { useGlobal, setup_subscriptions } from './store';


const drawerWidth = 90;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
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
        padding: theme.spacing.unit * 3,
    },
    logo: {
        maxWidth: '100%',
        padding: '10px 20px',
        maxHeight: '64px'
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
    let [queue, _] = useGlobal(
        state => state.queue,
        actions => null
    );
    useEffect(() => {
        setup_subscriptions(globalActions);
    }, []);

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    };

    const { classes, theme } = props;

    if (queue === undefined) {
        queue = [];
    }

    queue.sort((a, b) => { return a.job_id - b.job_id });

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <img src={Logo} className={classes.logo} />
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
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
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
                <div className={classes.sidebar}>
                    <div className={classes.toolbar} />
                    <h2>
                        Open Jobs
                        <Badge badgeContent={queue.length} color="primary" style={{ marginLeft: "15px" }}>
                            <WorkOutlineIcon />
                        </Badge>
                    </h2>
                    <div>
                        <List style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}>
                            {queue.map((job) => {
                                return <ListItem button className={classes.leftmenubtn} key={job.job_id}>
                                    <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                                    <ListItemText class="job-item" primary={job.series_name} secondary={job.job_type} />
                                </ListItem>
                            })}
                        </List>
                    </div>
                </div>
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
