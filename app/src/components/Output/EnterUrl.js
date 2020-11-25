import Grid from '@material-ui/core/Grid';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    textField: {
        width: 500
    }
}));

export default function EnterUrl({ url, setUrl }) {
    const classes = useStyles();

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    const error = url === '';

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
                    helperText={error ? "You have not entered any URL" : ''}
                    placeholder='https://some-webhook-url.com'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                    type="text"
                />
            </Grid>
        </Grid >
    );
}