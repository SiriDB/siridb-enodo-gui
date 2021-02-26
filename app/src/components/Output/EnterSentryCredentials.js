import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { version } from "../../../package.json";

export default function EnterDutyCallsChannels({ setUrl }) {
    const [projectId, setProjectId] = useState('');
    const [sentryKey, setSentryKey] = useState('');

    const updateUrl = (pi, sk) => {
        const baseUrl = `https://sentry.io/api/${pi}/store/`;
        const queryParams = `?sentry_version=${7}&sentry_key=${sk}&sentry_client=enodo/${version}`;
        setUrl(baseUrl + queryParams);
    };

    const handleChangeProjectId = (e) => {
        const pi = e.target.value;
        setProjectId(pi);
        updateUrl(pi, sentryKey);
    };

    const handleChangeSentryKey = (e) => {
        const sk = e.target.value;
        setSentryKey(sk);
        updateUrl(projectId, sk);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the credentials which should be included in the event update:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container direction='column' spacing={2}>
                    <Grid item>
                        <TextField
                            defaultValue={projectId}
                            onChange={handleChangeProjectId}
                            label='Sentry Project ID'
                            variant="outlined"
                            type="text"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            defaultValue={sentryKey}
                            onChange={handleChangeSentryKey}
                            label='Sentry Key'
                            variant="outlined"
                            type="text"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
}