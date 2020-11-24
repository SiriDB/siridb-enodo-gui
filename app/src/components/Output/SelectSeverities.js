import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function SelectSeverities({ severities, setSeverities }) {
    const handleChange = (event) => {
        let list = [...severities];
        if (event.target.checked && !list.includes(event.target.name)) {
            list.push(event.target.name);
        }
        else if (!event.target.checked && list.includes(event.target.name)) {
            list = list.filter(s => s !== event.target.name);
        }
        setSeverities(list);
    };

    const error = severities.length < 1;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'For which severities shoud an event update be send?'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset" error={error} >
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={severities.includes('warning')} onChange={handleChange} name="warning" />}
                            label="warning"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={severities.includes('error')} onChange={handleChange} name="error" />}
                            label="error"
                        />
                    </FormGroup>
                    {error && <FormHelperText>{'You have not selected any severity'}</FormHelperText>}
                </FormControl>
            </Grid>
        </Grid >
    );
}