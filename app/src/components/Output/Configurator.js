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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import EnterHeaders from './EnterHeaders';
import EnterPayload from './EnterPayload';
import SelectSeverities from './SelectSeverities';
import { EventOutputTypes } from '../../constants/enums';

const useStyles = makeStyles(theme => ({
    media: {
        height: 75
    },
    paperContent: {
        padding: theme.spacing(4),
        minHeight: 300
    },
    textField: {
        width: 500
    },
    stepper: {
        backgroundColor: '#fff'
    }
}));

export default function Configurator({ outputType, outputTypeProperties, onGoBack }) {
    const classes = useStyles();
    const theme = useTheme();

    const [activeStep, setActiveStep] = useState(0);
    const [forSeverities, setForSeverities] = useState([]);
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState({});
    const [payload, setPayload] = useState('{\n  \"title\": \"{{event.title}}\",\n  \"body\": \"{{event.message}}\",\n  \"dateTime\": {{event.ts}},\n  \"severity\": \"{{event.severity}}\"\n}');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const EnterUrl = () => {
        // const error = url === '';
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='subtitle2'>
                        {'Please enter the webhook URL to which event updates should be posted:'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        // error={error}
                        // helperText={error ? "You have not entered any URL" : ''}
                        // value={url}
                        placeholder='https://some-webhook-url.com'
                        onChange={(e) => setUrl(e.target.value)}
                        variant="outlined"
                        className={classes.textField}
                    />
                </Grid>
            </Grid >
        );
    };

    const Content = () => {
        if (outputType === EventOutputTypes.WEBHOOK) {
            return (
                activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                    activeStep === 1 ? <EnterUrl  /> :
                        activeStep === 2 ? <EnterHeaders headers={headers} setHeaders={setHeaders} /> :
                            <EnterPayload payload={payload} setPayload={setPayload} />
            );
        }
        else if (outputType === EventOutputTypes.SLACK) {
            return (
                activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                    // activeStep === 1 ? <EnterUrl  setUrl={setUrl} /> :
                    <EnterPayload payload={payload} setPayload={setPayload} />
            );
        }
        else if (outputType === EventOutputTypes.MS_TEAMS) {
            return (
                activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                    // activeStep === 1 ? <EnterUrl  setUrl={setUrl} /> :
                    <EnterPayload payload={payload} setPayload={setPayload} />
            );
        }
        else if (outputType === EventOutputTypes.DUTYCALLS) {
            return (
                activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                    // activeStep === 1 ? <EnterUrl  setUrl={setUrl} /> :
                    <EnterPayload payload={payload} setPayload={setPayload} />
            );
        }
        else if (outputType === EventOutputTypes.SENTRY) {
            return (
                activeStep === 0 ? <SelectSeverities severities={forSeverities} setSeverities={setForSeverities} /> :
                    // activeStep === 1 ? <EnterUrl  setUrl={setUrl} /> :
                    <EnterPayload payload={payload} setPayload={setPayload} />
            );
        }
    }

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
                            alt="Output type image"
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
                        <Content />
                    </div>
                    <MobileStepper
                        steps={outputTypeProperties.noSteps}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        className={classes.stepper}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === outputTypeProperties.noSteps - 1}>
                                {'Next'}
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
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