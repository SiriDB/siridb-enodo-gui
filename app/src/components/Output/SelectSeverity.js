import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import Typography from '@material-ui/core/Typography';

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
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_INFO} control={<Radio />} label="Info" />
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_WARNING} control={<Radio />} label="Warning" />
                        <FormControlLabel value={EventSeverityLevels.ENODO_EVENT_SEVERITY_ERROR} control={<Radio />} label="Error" />
                    </RadioGroup>
                    {error && <FormHelperText>{'You have not selected any severity'}</FormHelperText>}
                </FormControl>
            </Grid>
        </Grid >
    );
}