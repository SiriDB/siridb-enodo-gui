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

import EnterDutyCallsChannels from './EnterDutyCallsChannels';
import EnterDutyCallsCredentials from './EnterDutyCallsCredentials';
import EnterHeaders from './EnterHeaders';
import EnterPayload from './EnterPayload';
import EnterUrl from './EnterUrl';
import SelectSeverities from './SelectSeverities';
import { EventOutputTypes } from '../../constants/enums';
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

export default function Configurator({ outputType, outputTypeProperties, onGoBack, onSubmit }) {
    const classes = useStyles();
    const theme = useTheme();

    const [activeStep, setActiveStep] = useState(0);
    const [forSeverities, setForSeverities] = useState([]);
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState({});
    // eslint-disable-next-line
    const [payload, setPayload] = useState('{\n  \"title\": \"{{event.title}}\",\n  \"body\": \"{{event.message}}\",\n  \"dateTime\": {{event.ts}},\n  \"severity\": \"{{event.severity}}\"\n}');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleAddOutputStream = () => {
        const data = {
            "output_type": 1,
            "data": {
                "for_severities": forSeverities,
                "url": url,
                "headers": JSON.stringify(headers),
                "payload": payload
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
                        {outputType === EventOutputTypes.WEBHOOK &&
                            <React.Fragment>
                                {activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                                    activeStep === 1 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                        activeStep === 2 ? <EnterHeaders headers={headers} setHeaders={setHeaders} /> :
                                            <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {outputType === EventOutputTypes.SLACK &&
                            <React.Fragment>
                                {activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                                    activeStep === 1 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                        <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {outputType === EventOutputTypes.MS_TEAMS &&
                            <React.Fragment>
                                {activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                                    activeStep === 1 ? <EnterUrl url={url} setUrl={setUrl} /> :
                                        <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {outputType === EventOutputTypes.DUTYCALLS &&
                            <React.Fragment>
                                {activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                                    activeStep === 1 ? <EnterDutyCallsCredentials setHeaders={setHeaders} /> :
                                        activeStep === 2 ? <EnterDutyCallsChannels setUrl={setUrl} /> :
                                            <EnterPayload payload={payload} setPayload={setPayload} />}
                            </React.Fragment>
                        }
                        {outputType === EventOutputTypes.SENTRY &&
                            <React.Fragment>
                                {activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                                    activeStep === 1 ? <EnterUrl url={url} setUrl={setUrl} /> :
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