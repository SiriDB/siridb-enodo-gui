import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Link from '@material-ui/core/Link';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import EnterCustomName from './EnterCustomName';
import EnterDutyCallsChannels from './EnterDutyCallsChannels';
import EnterDutyCallsCredentials from './EnterDutyCallsCredentials';
import EnterHeaders from './EnterHeaders';
import EnterPayload from './EnterPayload';
import EnterUrl from './EnterUrl';
import SelectEventTypes from './SelectEventTypes';
import SelectSeverity from './SelectSeverity';
import { VendorNames, EventOutputTypes } from '../../constants/enums';
import { socket } from '../../store';

const useStyles = makeStyles(theme => ({
    media: {
        height: 75
    },
    paperContent: {
        padding: theme.spacing(4),
        height: 300
    },
    textField: {
        width: 500
    },
    stepper: {
        backgroundColor: '#fff'
    }
}));

export default function Configurator({ vendorName, outputTypeProperties, onGoBack, onSubmit }) {
    const classes = useStyles();
    const theme = useTheme();

    const [activeStep, setActiveStep] = useState(0);
    const [forSeverity, setForSeverity] = useState(null);
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState({});
    // eslint-disable-next-line
    const [payload, setPayload] = useState('{\n  \"title\": \"{{title}}\",\n  \"body\": \"{{message}}\",\n  \"dateTime\": {{ts}},\n  \"severity\": \"{{severity}}\"\n}');
    const [eventTypes, setEventTypes] = useState([]);
    const [customName, setCustomName] = useState('');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddOutputStream = () => {
        const data = {
            "output_type": EventOutputTypes.ENODO_EVENT_OUTPUT_WEBHOOK,
            "data": {
                "severity": forSeverity,
                "url": url,
                "headers": headers,
                "payload": payload,
                "custom_name": customName,
                "vendor_name": vendorName,
                "for_event_types": eventTypes
            }
        };
        socket.emit(`/api/event/output/create`, data, () => {
            onSubmit();
            onGoBack();
        });
    };

    return (
        <Grid container spacing={4} className={classes.root}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={2}>
                        <IconButton onClick={onGoBack}>
                            <ArrowBackIcon size='small' />
                        </IconButton>

                    </Grid>
                    <Grid item xs={2}>
                        <img
                            className={classes.media}
                            src={outputTypeProperties.image}
                            alt="Output type"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='h5'>{outputTypeProperties.name}</Typography>
                        <Typography variant='caption'>
                            {outputTypeProperties.description}
                            {outputTypeProperties.link && ' '}
                            {outputTypeProperties.link &&
                                <Link href={outputTypeProperties.link} target="_blank" rel="noreferrer" >
                                    {outputTypeProperties.link}
                                </Link>}
                            {outputTypeProperties.link && '.'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <div className={classes.paperContent}>
                        {vendorName === VendorNames.WEBHOOK &&
                            <React.Fragment>
                                {activeStep === 0 ? <EnterCustomName name={customName} setName={setCustomName} /> :
                                    activeStep === 1 ? <SelectEventTypes eventTypes={eventTypes} setEventTypes={setEventTypes} /> :
                                        activeStep === 2 ? <SelectSeverity severity={forSeverity} setSeverity={setForSeverity} /> :
                                            activeStep === 3 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                                activeStep === 4 ? <EnterHeaders headers={headers} setHeaders={setHeaders} /> :
                                                    <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {vendorName === VendorNames.SLACK &&
                            <React.Fragment>
                                {activeStep === 0 ? <EnterCustomName name={customName} setName={setCustomName} /> :
                                    activeStep === 1 ? <SelectEventTypes eventTypes={eventTypes} setEventTypes={setEventTypes} /> :
                                        activeStep === 2 ? <SelectSeverity severity={forSeverity} setSeverity={setForSeverity} /> :
                                            activeStep === 3 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                                <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {vendorName === VendorNames.MS_TEAMS &&
                            <React.Fragment>
                                {activeStep === 0 ? <EnterCustomName name={customName} setName={setCustomName} /> :
                                    activeStep === 1 ? <SelectEventTypes eventTypes={eventTypes} setEventTypes={setEventTypes} /> :
                                        activeStep === 2 ? <SelectSeverity severity={forSeverity} setSeverity={setForSeverity} /> :
                                            activeStep === 3 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                                <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {vendorName === VendorNames.DUTYCALLS &&
                            <React.Fragment>
                                {activeStep === 0 ? <EnterCustomName name={customName} setName={setCustomName} /> :
                                    activeStep === 1 ? <SelectEventTypes eventTypes={eventTypes} setEventTypes={setEventTypes} /> :
                                        activeStep === 2 ? <SelectSeverity severity={forSeverity} setSeverity={setForSeverity} /> :
                                            activeStep === 3 ? <EnterDutyCallsCredentials setHeaders={setHeaders} /> :
                                                activeStep === 4 ? <EnterDutyCallsChannels setUrl={setUrl} /> :
                                                    <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                    </div>
                    <MobileStepper
                        steps={outputTypeProperties.noSteps}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        className={classes.stepper}
                        nextButton={
                            activeStep !== outputTypeProperties.noSteps - 1 ?
                                <Button size="small" onClick={handleNext} disabled={activeStep === outputTypeProperties.noSteps - 1}>
                                    {'Next'}
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </Button> :
                                <Button color='primary' onClick={handleAddOutputStream} disabled={activeStep !== outputTypeProperties.noSteps - 1}>
                                    {'Add'}
                                </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                {'Back'}
                            </Button>
                        }
                    />
                </Paper>
            </Grid>
        </Grid >

    );
}