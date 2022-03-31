import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import Typography from '@mui/material/Typography';

import { EventSeverityLevels } from '../../constants/enums';

export default function SelectSeverity({ severity, setSeverity }) {

    const handleChange = (event) => {
        setSeverity(event.target.value);
    };

    const error = severity === null;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Which severity should be added to event updates of this type?'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset" error={error} >
                    <RadioGroup value={severity} onChange={handleChange}>
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_INFO} control={<Radio />} label="info" />
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_WARNING} control={<Radio />} label="warning" />
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_ERROR} control={<Radio />} label="error" />
                    </RadioGroup>
                    {error && <FormHelperText>{'You have not selected any severity'}</FormHelperText>}
                </FormControl>
            </Grid>
        </Grid >
    );
}