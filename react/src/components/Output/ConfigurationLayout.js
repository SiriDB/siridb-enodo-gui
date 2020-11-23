import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(theme => ({
    media: {
        height: 75
    },
    paperContent: {
        padding: theme.spacing(3)
    },
    stepper: {
        backgroundColor: '#fff'
    }
}));

export default function ConfigurationLayout({ name, image, noSteps, onGoBack, childern }) {
    const classes = useStyles();
    const theme = useTheme();

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Grid container spacing={2}>
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
                            src={image}
                            alt="Output type image"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='h5'>{name}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <div className={classes.paperContent}>
                        Some text ...
                    </div>
                    <MobileStepper
                        steps={noSteps}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        className={classes.stepper}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === noSteps - 1}>
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