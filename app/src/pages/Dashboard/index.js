import AssessmentIcon from '@mui/icons-material/Assessment';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Grid from '@mui/material/Grid';
import HearingIcon from '@mui/icons-material/Hearing';
import React, { useState, useEffect } from 'react';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import WorkIcon from '@mui/icons-material/Work';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import * as ROUTES from '../../constants/routes';
import BasicPageLayout from '../../components/BasicPageLayout';
import DashboardItem from '../../components/DashboardItem';
import { socket } from '../../store';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1)
    },
    icon: {
        height: theme.spacing(4),
        width: theme.spacing(4),
        color: '#fff'
    },
    extraInfoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    extraInfoIcon: {
        marginRight: theme.spacing(0.5)
    }
}));

const DashboardPage = () => {
    const classes = useStyles();
    let history = useHistory();

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
        <BasicPageLayout title='Dashboard' hideJobDrawer>
            {stats ?
                <div className={classes.root}>
                    <Grid container spacing={6} justifyContent='center' alignItems="center">
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Series"
                                value={stats.no_series}
                                icon={<AssessmentIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.TIME_SERIES })}
                                status={"info"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Ignored series"
                                value={stats.no_ignored_series}
                                icon={<AssessmentIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.NETWORK })}
                                status={stats.no_ignored_series > 0 ? "warning" : "success"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Open jobs"
                                value={stats.no_open_jobs}
                                icon={<WorkIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.TIME_SERIES })}
                                status={"info"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Active jobs"
                                value={stats.no_active_jobs}
                                icon={<WorkIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.TIME_SERIES })}
                                status='info'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Failed jobs"
                                value={stats.no_failed_jobs}
                                icon={<WorkOffIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.TIME_SERIES })}
                                status={stats.no_failed_jobs > 0 ? "error" : "success"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Listeners"
                                value={stats.no_listeners}
                                icon={<HearingIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.NETWORK })}
                                status={"info"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Busy workers"
                                value={stats.no_busy_workers + ' / ' + stats.no_workers}
                                icon={<EventBusyIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.NETWORK })}
                                status={stats.no_busy_workers === stats.no_workers ? 'warning' : "success"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <DashboardItem
                                title="Output streams"
                                value={stats.no_output_streams}
                                icon={<ViewStreamIcon className={classes.icon} />}
                                action={() => history.push({ pathname: ROUTES.OUTPUT_STREAMS })}
                                status={"info"}
                            />
                        </Grid>
                    </Grid>
                </ div> :
                <Grid container justifyContent='center'>
                    <CircularProgress />
                </Grid>}
        </BasicPageLayout>
    );
}

export default DashboardPage;
