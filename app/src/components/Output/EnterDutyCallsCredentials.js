import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default function EnterDutyCallsCredentials({ setHeaders }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const changeHeaders = (un, pass) => {
        let object = {};
        const value = 'Basic ' + btoa(un + ":" + pass);
        object['Authorization'] = value;
        setHeaders(object);
    }

    const handleChangeUsername = (e) => {
        const un = e.target.value;
        setUsername(un);
        changeHeaders(un, password);
    };

    const handleChangePassword = (e) => {
        const pass = e.target.value;
        setPassword(pass);
        changeHeaders(username, pass);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the credentials which should be included in the event update:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container direction='row' spacing={2}>
                    <Grid item>
                        <TextField
                            defaultValue={username}
                            onChange={handleChangeUsername}
                            label='Username'
                            variant="outlined"
                            type="text"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            defaultValue={password}
                            onChange={handleChangePassword}
                            label='Password'
                            variant="outlined"
                            type="password"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
}