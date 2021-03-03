import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: 235
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

export default function EnterPayload({ payload, setPayload, addAdvancedButton }) {
    const classes = useStyles();

    const [allowPayloadEdit, setAllowPayloadEdit] = useState(addAdvancedButton ? false : true);

    const handleChange = (e) => {
        setPayload(e.target.value);
    };

    const handleChangeCheckbox = (event) => {
        setAllowPayloadEdit(event.target.checked);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {!addAdvancedButton ? 'Please enter the payload, which will be included in the event update:' : 'If necessary, edit the payload below, which will be included in the event update:'}
                </Typography>
            </Grid>
            {addAdvancedButton &&
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox checked={allowPayloadEdit} onChange={handleChangeCheckbox} />}
                        label="Edit payload (only for advanced users)"
                    />
                </Grid>}
            <Grid item xs={12} md={6}>
                <TextField
                    defaultValue={payload}
                    multiline
                    rows={10}
                    placeholder='Valid JSON'
                    onChange={handleChange}
                    variant="outlined"
                    type="text"
                    fullWidth
                    disabled={!allowPayloadEdit}
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
                            {'event.uuid'}
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