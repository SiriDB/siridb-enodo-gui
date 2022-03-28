import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import isURL from 'validator/lib/isURL';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    textField: {
        width: 500
    }
}));

export default function EnterUrl({ url, setUrl }) {
    const classes = useStyles();
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value
        setUrl(value);
        if (isURL(value)) {
            setError(false);
        }
        else {
            setError(true);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the webhook URL to which event updates should be posted:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={error}
                    helperText={error ? "You have not entered a valid URL" : ''}
                    placeholder='https://some-webhook-url.com'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                    type="text"
                    defaultValue={url}
                />
            </Grid>
        </Grid >
    );
}