import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import WorkIcon from '@material-ui/icons/Work';
import WorkOffIcon from '@material-ui/icons/WorkOff';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import { makeStyles } from '@material-ui/core/styles';

import { socket } from '../../store';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    sidebar: {
        width: 350,
        maxWidht: '20vw',
        padding: theme.spacing(3)
    },
    divider: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(3)
    }
}));

const BasicPageLayout = ({ title, buttonAction, buttonText, hideJobDrawer, titleButton, children }) => {
    const classes = useStyles();

    const [stats, setStats] = useState(null);

    const retrieveInfo = () => {
        socket.emit('/api/enodo/stats', {}, (data) => {
            setStats(data.data)
        });
    };

    useEffect(() => {
        retrieveInfo();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            retrieveInfo();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Grid container>
            <Grid item style={{ flex: 1 }}>
                <Grid container direction='column' spacing={2} >
                    <Grid item>
                        <Grid container justifyContent='space-between'>
                            <Grid item>
                                <Grid container spacing={1} alignItems='center'>
                                    <Grid item>
                                        <Typography variant='h4'>{title}</Typography>
                                    </Grid>
                                    {titleButton ?
                                        <Grid item>
                                            {titleButton}
                                        </Grid> : null}
                                </Grid>
                            </Grid>
                            <Grid>
                                {buttonAction && buttonText &&
                                    <Button variant='contained' color='primary' onClick={buttonAction}>
                                        {buttonText}
                                    </Button>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {children}
                    </Grid>
                </Grid>
            </Grid>
            {!hideJobDrawer &&
                <Hidden mdDown>
                    <Grid item>
                        <Drawer
                            variant="permanent"
                            open
                            className={classes.sidebar}
                            classes={{
                                paper: classes.sidebar
                            }}
                            anchor='right'
                        >
                            <div className={classes.toolbar} />
                            <Typography variant='h4' gutterBottom className={classes.title}>
                                {'Jobs'}
                            </Typography>
                            <Typography variant='h6' gutterBottom>
                                {'Open'}
                                <Badge badgeContent={stats ? stats.no_open_jobs : null} color="primary" style={{ marginLeft: 12 }}>
                                    <WorkOutlineIcon />
                                </Badge>
                            </Typography>
                            <Typography>
                                {`Currently there are ${stats ? stats.no_open_jobs : 0} jobs waiting to be picked-up by a worker.`}
                            </Typography>
                            <Divider className={classes.divider} />
                            <Typography variant='h6' gutterBottom>
                                {'Active'}
                                <Badge badgeContent={stats ? stats.no_active_jobs : null} color="primary" style={{ marginLeft: 12 }}>
                                    <WorkIcon />
                                </Badge>
                            </Typography>
                            <Typography>
                                {`Currently there are ${stats ? stats.no_active_jobs : 0} jobs being processed by a worker.`}
                            </Typography>
                            <Divider className={classes.divider} />
                            <Typography variant='h6' gutterBottom>
                                {'Failed'}
                                <Badge badgeContent={stats ? stats.no_failed_jobs : null} color="primary" style={{ marginLeft: 12 }}>
                                    <WorkOffIcon />
                                </Badge>
                            </Typography>
                            <Typography>
                                {`Currently there are ${stats ? stats.no_failed_jobs : 0} failed jobs.`}
                            </Typography>
                        </Drawer>
                    </Grid>
                </Hidden>}
        </Grid>
    );
}

export default BasicPageLayout;
