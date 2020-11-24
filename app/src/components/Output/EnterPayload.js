import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
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
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setPayload(e.target.value);
        try {
            JSON.parse(e.target.value);
            setError(null);
        }
        catch {
            setError("Invalid JSON provided");

        }
    };

    console.log(error)

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the payload which should be included in the event update:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={error ? true : false}
                    defaultValue={payload}
                    multiline
                    rows={6}
                    helperText={error}
                    placeholder='Valid JSON'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                />
            </Grid>
        </Grid >
    );
}