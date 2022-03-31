import Grid from '@mui/material/Grid';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the name that should be given to this output stream:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    placeholder='Some name'
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.textField}
                    type="text"
                    defaultValue={name}
                />
            </Grid>
        </Grid >
    );
}