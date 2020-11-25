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

export default function EnterPayload({ payload, setPayload }) {
    const classes = useStyles();

    const handleChange = (e) => {
        setPayload(e.target.value);
    };

    const error = payload === '';

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the payload which should be included in the event update:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={error}
                    helperText={error ? "You have not entered any payload" : ''}
                    defaultValue={payload}
                    multiline
                    rows={6}
                    placeholder='Valid JSON'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                    type="text"
                />
            </Grid>
        </Grid >
    );
}