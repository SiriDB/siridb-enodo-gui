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
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ConfigurationLayout from './ConfigurationLayout';
import DCLogo from '../../../public/assets/dc-icon-red.png';
import MSTeamsLogo from '../../../public/assets/ms_teams_logo.png';
import SentryLogo from '../../../public/assets/sentry-glyph-dark.png';
import SlackLogo from '../../../public/assets/slack_logo.png';
import WebhookLogo from '../../../public/assets/webhooks.png';
import { EventOutputTypes } from '../../constants/enums';

const outputTypeProperties = {
    1: {
        name: "Generic Webhook",
        img: WebhookLogo,
        noSteps: 5
    },
    2: {
        name: "Slack",
        img: SlackLogo,
        noSteps: 5
    },
    3: {
        name: "Microsoft Teams",
        img: MSTeamsLogo,
        noSteps: 5
    },
    4: {
        name: "DutyCalls",
        img: DCLogo,
        noSteps: 5
    },
    5: {
        name: "Sentry",
        img: WebhookLogo,
        noSteps: 5
    }
};

const useStyles1 = makeStyles({
    root: {
        width: 250,
    },
    media: {
        height: 125,
        backgroundColor: '#f0f0f0',
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
        padding: theme.spacing(4)
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
                            <OutputTypeCard name='Slack' image={SlackLogo} onClick={() => setOutputType(EventOutputTypes.SLACK)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name='Microsoft Teams' image={MSTeamsLogo} onClick={() => setOutputType(EventOutputTypes.MS_TEAMS)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name='DutyCalls' image={DCLogo} onClick={() => setOutputType(EventOutputTypes.DUTYCALLS)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name='Sentry' image={SentryLogo} onClick={() => setOutputType(EventOutputTypes.SENTRY)} />
                        </Grid>
                        <Grid item xs={4}>
                            <OutputTypeCard name='Generic Webhook' image={WebhookLogo} onClick={() => setOutputType(EventOutputTypes.WEBHOOK)} />
                        </Grid>
                    </Grid>
                </React.Fragment> :
                    <ConfigurationLayout
                        name={outputTypeProperties[outputType].name}
                        image={outputTypeProperties[outputType].img}
                        noSteps={outputTypeProperties[outputType].noSteps}
                        onGoBack={resetOutputType}
                    >

                    </ConfigurationLayout>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}