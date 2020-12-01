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

export default function EnterCustomName({ name, setName }) {
    const classes = useStyles();

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const error = name === '';

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the name that should be given to this output stream:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={error}
                    helperText={error ? "You have not entered any name" : ''}
                    placeholder='Some name'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                    type="text"
                />
            </Grid>
        </Grid >
    );
}