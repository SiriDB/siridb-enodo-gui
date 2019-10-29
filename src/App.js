import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MessageIcon from '@material-ui/icons/Message';
import AssessmentIcon from '@material-ui/icons/Assessment';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {HashRouter, Link, Route, Switch} from "react-router-dom";
import Menu from "./Menu";
import TimeSeriesContainer from "./TimeSeriesContainer";
import Settings from "./Settings/Settings";
import NetworkMap from "./Network/NetworkMap";

import StatusBar from './util/StatusBar';
import EventLogList from './EventLogList';

import {useGlobal, setup_subscriptions} from './store';


const drawerWidth = 240;

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
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    logo: {
        maxWidth: '100%',
        padding: '10px 20px',
        maxHeight: '64px'
    }
});

const App = (props) => {
    const [globalState, globalActions] = useGlobal();
    useEffect(() => {
        setup_subscriptions(globalActions);
    }, []);

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    };

    const {classes, theme} = props;

    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <img src='assets/logo_full.png' className={classes.logo}/>
            </div>
            <Divider/>
            <List>
                <Link to="/series">
                    <ListItem button>
                        <ListItemIcon><AssessmentIcon/></ListItemIcon>
                        <ListItemText primary="Series"/>
                    </ListItem>
                </Link>
                <ListItem button>
                    <ListItemIcon><TimelineIcon/></ListItemIcon>
                    <ListItemText primary="Anomalies"/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon><TimelineIcon/></ListItemIcon>
                    <ListItemText primary="Outlier"/>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <Link to="/network">
                    <ListItem button>
                        <ListItemIcon><TimelineIcon/></ListItemIcon>
                        <ListItemText primary="Network"/>
                    </ListItem>
                </Link>
            </List>
            <Divider/>
            <List>
                <Link to="/settings">
                    <ListItem button>
                        <ListItemIcon><SettingsIcon/></ListItemIcon>
                        <ListItemText primary="Settings"/>
                    </ListItem>
                </Link>
            </List>
        </div>
    );

    return (
        <HashRouter>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" implementation="css" color="inherit" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            aria-label="Open drawer"
                            implementation="css"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" implementation="css" noWrap>

                        </Typography>
                    </Toolbar>
                </AppBar>
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
                    <div className={classes.toolbar}/>

                    <Switch>
                        <Route exact path='/' component={Menu}/>
                        <Route path='/series' component={TimeSeriesContainer}/>
                        <Route path='/settings/:catid' component={Settings}/>
                        <Route path='/settings' component={Settings}/>
                        <Route path='/network' component={NetworkMap}/>
                    </Switch>

                </main>
                <StatusBar/>
                <div style={{
                    width: '400px',
                    flexShrink: 0,
                }}>
                    <Drawer variant="persistent"
                            anchor="right" open={true} onClose={() => {
                    }}>
                        <div style={{width: '400px', flexShrink: 0,}}>
                            <div style={{color: 'white', padding: '10px', marginTop: '10px'}}>
                                <MessageIcon/> Event log
                            </div>
                            <EventLogList/>
                        </div>
                    </Drawer>
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

export default withStyles(styles, {withTheme: true})(App);
