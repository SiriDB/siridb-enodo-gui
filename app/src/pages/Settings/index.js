import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import Divider from "@material-ui/core/Divider";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

import BasicPageLayout from '../../components/BasicPageLayout';
import { socket, useGlobal } from '../../store';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(5)
    },
    textField: {
        width: 500
    }
}));

const OutputStreamsPage = () => {
    const classes = useStyles();
    const [settings, setSettings] = useState(null);
    const [siridb, setSiridb] = useState(null);
    const [siridbForecast, setSiridbForecast] = useState(null);
    const [sameDatabaseChecked, setSameDatabaseChecked] = useState(false);

    const [siridb_status] = useGlobal(
        state => state.siridb_status
    );

    const retrieveSettings = () => {
        socket.emit('/api/enodo/settings', {}, (data) => {
            setSettings(data.data)
            setSiridb(data.data.siridb);
            setSiridbForecast(data.data.siridb_forecast);
            setSameDatabaseChecked(JSON.stringify(data.data.siridb) === JSON.stringify(data.data.siridb_forecast));
        });
    };

    useEffect(() => {
        retrieveSettings();
    }, []);

    const toggleCheckbox = () => {
        const newValue = !sameDatabaseChecked;
        setSameDatabaseChecked(newValue);
        if (newValue) {
            setSiridbForecast(siridb);
            saveSettings({
                "section": 'siridb_forecast',
                "entries": siridb
            });
        }
    };

    const saveSettings = (data) => {
        socket.emit(`/api/enodo/settings/update`, data, () => {
            retrieveSettings();
        });
    }

    const handleChange = (target, databaseType) => {
        if (databaseType === 'siridb') {
            setSiridb(s => ({ ...s, [target.name]: target.value }));
        }
        else {
            setSiridbForecast(s => ({ ...s, [target.name]: target.value }));
        }
    };

    return (
        <BasicPageLayout title='Settings'>
            {settings && siridb && siridbForecast ?
                <Paper className={classes.paper}>
                    <Grid container direction='column' spacing={3}>
                        <Grid item>
                            <Typography variant='h5' gutterBottom>
                                {'SiriDB connections'}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='subtitle2'>
                                {'Analysis database'}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid container direction='row' spacing={3}>
                                <Grid item xs={6}>
                                    <Grid container spacing={2} direction='column'>
                                        <Grid item>
                                            <TextField
                                                placeholder='Host'
                                                name='host'
                                                onChange={(e) => handleChange(e.target, 'siridb')}
                                                variant="outlined"
                                                className={classes.textField}
                                                type="text"
                                                value={siridb.host}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                placeholder='Port'
                                                name='port'
                                                onChange={(e) => handleChange(e.target, 'siridb')}
                                                variant="outlined"
                                                className={classes.textField}
                                                type="number"
                                                value={siridb.port}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                placeholder='Username'
                                                name='user'
                                                onChange={(e) => handleChange(e.target, 'siridb')}
                                                variant="outlined"
                                                className={classes.textField}
                                                type="text"
                                                value={siridb.user}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                placeholder='Password'
                                                name='password'
                                                onChange={(e) => handleChange(e.target, 'siridb')}
                                                variant="outlined"
                                                className={classes.textField}
                                                type="text"
                                                value={siridb.password}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                placeholder='Database name'
                                                name='database'
                                                onChange={(e) => handleChange(e.target, 'siridb')}
                                                variant="outlined"
                                                className={classes.textField}
                                                type="text"
                                                value={siridb.database}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={() => {
                                                    saveSettings({
                                                        "section": 'siridb',
                                                        "entries": siridb
                                                    });
                                                    if (sameDatabaseChecked) {
                                                        saveSettings({
                                                            "section": 'siridb_forecast',
                                                            "entries": siridb
                                                        });
                                                    }
                                                }}
                                                disabled={siridb === settings['siridb']}
                                            >
                                                {'Save'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} style={{ display: 'flex' }}>
                                    <Grid container justify='center' alignItems='center' direction='column'>
                                        <Grid item>
                                            {siridb_status.data_conn ?
                                                <CloudDoneIcon color='primary' style={{ fontSize: 80 }} /> :
                                                <CloudOffIcon color='disabled' style={{ fontSize: 80 }} />}
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='h6' color={siridb_status.data_conn ? 'primary' : 'textSecondary'}>
                                                {siridb_status.data_conn ? 'You are connected' : 'You are not connected'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Divider />
                        </Grid>
                        <Grid item>
                            <Grid container direction='row' spacing={3}>
                                <Grid item xs={12}>
                                    <Grid container direction='row' justify='space-between' alignItems='center'>
                                        <Grid item>
                                            <Typography variant='subtitle2'>
                                                {'Forecast database'}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={sameDatabaseChecked}
                                                        onChange={toggleCheckbox}
                                                        color="primary"
                                                    />
                                                }
                                                label='Is the same as the analysis database'
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {!sameDatabaseChecked &&
                                    <React.Fragment>
                                        <Grid item xs={6}>
                                            <Grid container spacing={2} direction='column'>
                                                <Grid item>
                                                    <TextField
                                                        placeholder='Host'
                                                        name='host'
                                                        onChange={(e) => handleChange(e.target, 'siridb_forecast')}
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        type="text"
                                                        value={siridbForecast.host}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        placeholder='Port'
                                                        name='port'
                                                        onChange={(e) => handleChange(e.target, 'siridb_forecast')}
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        type="number"
                                                        value={siridbForecast.port}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        placeholder='Username'
                                                        name='user'
                                                        onChange={(e) => handleChange(e.target, 'siridb_forecast')}
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        type="text"
                                                        value={siridbForecast.user}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        placeholder='Password'
                                                        name='password'
                                                        onChange={(e) => handleChange(e.target, 'siridb_forecast')}
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        type="text"
                                                        value={siridbForecast.password}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        placeholder='Database name'
                                                        name='database'
                                                        onChange={(e) => handleChange(e.target, 'siridb_forecast')}
                                                        variant="outlined"
                                                        className={classes.textField}
                                                        type="text"
                                                        value={siridbForecast.database}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={() => saveSettings({
                                                            "section": 'siridb_forecast',
                                                            "entries": siridbForecast
                                                        })}
                                                        disabled={siridbForecast === settings['siridb_forecast']}
                                                    >
                                                        {'Save'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={6} style={{ display: 'flex' }}>
                                            <Grid container justify='center' alignItems='center' direction='column'>
                                                <Grid item>
                                                    {siridb_status.analysis_conn ?
                                                        <CloudDoneIcon color='primary' style={{ fontSize: 80 }} /> :
                                                        <CloudOffIcon color='disabled' style={{ fontSize: 80 }} />}
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant='h6' color={siridb_status.analysis_conn ? 'primary' : 'textSecondary'}>
                                                        {siridb_status.analysis_conn ? 'You are connected' : 'You are not connected'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper> : null
            }
        </BasicPageLayout >
    );
}

export default OutputStreamsPage;
