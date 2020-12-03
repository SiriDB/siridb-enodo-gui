import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: 207
    },
    code: {
        color: 'white',
        backgroundColor: 'grey',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderRadius: theme.spacing(1),
        width: 'min-content',
        marginBottom: theme.spacing(1)
    },
    marginBottom: {
        marginBottom: theme.spacing(1)
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
            <Grid item xs={12} md={6}>
                <TextField
                    error={error}
                    helperText={error ? "You have not entered any payload" : ''}
                    defaultValue={payload}
                    multiline
                    rows={10}
                    placeholder='Valid JSON'
                    onChange={handleChange}
                    variant="outlined"
                    type="text"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper variant='outlined' className={classes.paper}>
                    <Typography component='div'>
                        <Box fontWeight='bold' className={classes.marginBottom}>
                            {'Available template variables:'}
                        </Box>
                        <Box className={classes.code}>
                            {'event.title'}
                        </Box>
                        <Box className={classes.code}>
                            {'event.message'}
                        </Box>
                        <Box className={classes.code}>
                            {'event.ts'}
                        </Box>
                        <Box className={classes.code}>
                            {'severity'}
                        </Box>
                        <Box fontStyle='italic' fontSize={14}>
                            {'* Note: template variables used in the payload must be wrapped with: {{ }}'}
                        </Box>
                    </Typography>

                </Paper>
            </Grid>
        </Grid >
    );
}