import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import { EventTypes } from '../../constants/enums';

export default function SelectEventTypes({ eventTypes, setEventTypes }) {
    const handleChange = (event) => {
        let list = [...eventTypes];
        if (event.target.checked && !list.includes(event.target.name)) {
            list.push(event.target.name);
        }
        else if (!event.target.checked && list.includes(event.target.name)) {
            list = list.filter(s => s !== event.target.name);
        }
        setEventTypes(list);
    };

    const error = eventTypes.length < 1;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'For which event types shoud an event update be send?'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset" error={error} >
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={eventTypes.includes(EventTypes.ENODO_EVENT_ANOMALY_DETECTED)}
                                    onChange={handleChange}
                                    name={EventTypes.ENODO_EVENT_ANOMALY_DETECTED}
                                />
                            }
                            label="Anomaly detected"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={eventTypes.includes(EventTypes.ENODO_EVENT_JOB_QUEUE_TOO_LONG)}
                                    onChange={handleChange}
                                    name={EventTypes.ENODO_EVENT_JOB_QUEUE_TOO_LONG}
                                />
                            }
                            label="Job queue too long"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={eventTypes.includes(EventTypes.ENODO_EVENT_LOST_CLIENT_WITHOUT_GOODBYE)}
                                    onChange={handleChange}
                                    name={EventTypes.ENODO_EVENT_LOST_CLIENT_WITHOUT_GOODBYE}
                                />
                            }
                            label="Lost client without goodbye"
                        />
                    </FormGroup>
                    {error && <FormHelperText>{'You have not selected any event types'}</FormHelperText>}
                </FormControl>
            </Grid>
        </Grid >
    );
}