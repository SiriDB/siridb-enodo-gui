import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default function EnterDutyCallsCredentials({ setHeaders }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const changeHeaders = () => {
        let object = {};
        const value = 'Basic ' + btoa(username + ":" + password);
        object['Authorization'] = value;
        setHeaders(object);
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
        changeHeaders();
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        changeHeaders();
    };

    const usernameError = username === '';
    const passwordError = password === '';

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
                            error={usernameError}
                            helperText={usernameError ? "You have not entered any username" : ''}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            defaultValue={password}
                            onChange={handleChangePassword}
                            label='Password'
                            variant="outlined"
                            type="password"
                            error={passwordError}
                            helperText={passwordError ? "You have not entered any password" : ''}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
}