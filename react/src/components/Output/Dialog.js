import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Configurator from './Configurator';
import DCLogo from '../../../public/assets/dc-icon-red.png';
import MSTeamsLogo from '../../../public/assets/ms_teams_logo.png';
import SentryLogo from '../../../public/assets/sentry-glyph-dark.png';
import SlackLogo from '../../../public/assets/slack_logo.png';
import WebhookLogo from '../../../public/assets/webhooks.png';
import { EventOutputTypes } from '../../constants/enums';

const outputTypeProperties = {
    1: {
        name: "Generic Webhook",
        image: WebhookLogo,
        noSteps: 4,
        description: 'Output events to a desired webhook URL.',
        link: null
    },
    2: {
        name: "Slack",
        image: SlackLogo,
        noSteps: 3,
        description: 'Output events to a desired Slack channel. A prerequisite for this configuration is that you have completed the following tutorial:',
        link: 'https://api.slack.com/messaging/webhooks'
    },
    3: {
        name: "Microsoft Teams",
        image: MSTeamsLogo,
        noSteps: 3,
        description: 'Output events to a desired Microsoft Teams channel. A prerequisite for this configuration is that you have completed the following tutorial:',
        link: 'https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook'
    },
    4: {
        name: "DutyCalls",
        image: DCLogo,
        noSteps: 4,
        description: 'Output events to a desired DutyCalls channel. A prerequisite for this configuration is that you have completed the following tutorial:',
        link: 'https://docs.dutycalls.me/getting-started/'
    },
    5: {
        name: "Sentry",
        image: WebhookLogo,
        noSteps: 5,
        description: 'Output events to a desired Sentry "something". A prerequisite for this configuration is that you have completed the following tutorial:',
        link: 'https://some-tutorial.com'
    }
};

const useStyles1 = makeStyles({
    root: {
        width: 250,
    },
    media: {
        height: 125,
        backgroundSize: 70,
        backgroundPosition: 'center'
    }
});

function OutputTypeCard({ name, image, onClick }) {
    const classes = useStyles1();
    return (
        <Card className={classes.root}>
            <CardActionArea onClick={onClick}>
                <CardMedia
                    className={classes.media}
                    image={image}
                    title="Output type image"
                />
                <Divider />
                <CardContent>
                    <Typography gutterBottom variant="h6">
                        {name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

const useStyles2 = makeStyles(theme => ({
    dialogContent: {
        padding: theme.spacing(4),
        backgroundColor: '#f0f0f0'
    }
}));

export default function OutputDialog({ open, handleClose, onSubmit }) {
    const classes = useStyles2();

    const [outputType, setOutputType] = useState(null);

    const resetOutputType = () => {
        setOutputType(null);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='md'

        >
            <DialogTitle id="alert-dialog-title">{"Add Output Stream"}</DialogTitle>
            <DialogContent dividers className={classes.dialogContent}>
                {outputType === null ? <React.Fragment>
                    <DialogContentText id="alert-dialog-description">
                        {'Select the output type you want to add.'}
                    </DialogContentText>
                    <Grid container spacing={4} justify='flex-start'>
                        <Grid item xs={4}>
                            <OutputTypeCard name={outputTypeProperties[EventOutputTypes.SLACK].name} image={SlackLogo} onClick={() => setOutputType(EventOutputTypes.SLACK)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name={outputTypeProperties[EventOutputTypes.MS_TEAMS].name} image={MSTeamsLogo} onClick={() => setOutputType(EventOutputTypes.MS_TEAMS)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name={outputTypeProperties[EventOutputTypes.DUTYCALLS].name} image={DCLogo} onClick={() => setOutputType(EventOutputTypes.DUTYCALLS)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name={outputTypeProperties[EventOutputTypes.SENTRY].name} image={SentryLogo} onClick={() => setOutputType(EventOutputTypes.SENTRY)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name={outputTypeProperties[EventOutputTypes.WEBHOOK].name} image={WebhookLogo} onClick={() => setOutputType(EventOutputTypes.WEBHOOK)} />
                        </Grid>
                    </Grid>
                </React.Fragment> :
                    <Configurator
                        outputType={outputType}
                        outputTypeProperties={outputTypeProperties[outputType]}
                        onGoBack={resetOutputType}
                    />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}