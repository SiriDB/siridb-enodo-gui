import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    textFieldContainer: {
        height: 90
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        }
    }
}));

export default function EnterDutyCallsChannels({ setUrl }) {
    const classes = useStyles();

    const [channel, setChannel] = useState('');
    const [channels, setChannels] = useState([]);

    const onChange = ({ target }) => {
        setChannel(target.value);
    };

    const updateUrl = (chnls) => {
        let baseUrl = 'https://dutycalls.me/api/ticket';
        chnls.forEach((channel, index) => {
            if (index === 0) {
                baseUrl += `?channel=${channel}`
            }
            else {
                baseUrl += `&channel=${channel}`
            }
        });
        setUrl(baseUrl);
    };

    const onAddChannel = () => {
        const chnls = [...channels];
        chnls.push(channel)
        setChannels(chnls);
        setChannel('');
        updateUrl(chnls);
    }

    const onRemoveChannel = (value) => {
        const chnls = [...channels];
        const index = chnls.indexOf(value);
        if (index > -1) {
            chnls.splice(index, 1);
        }
        setChannels(chnls);
        updateUrl(chnls);
    }

    let channelInvalid = (channel === '' || channels.includes(channel));

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid container alignItems='center' spacing={2} className={classes.textFieldContainer}>
                    <Grid item>
                        <TextField
                            value={channel}
                            label='Channel'
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={onAddChannel}
                            color='primary'
                            disabled={channelInvalid}
                            size="large">
                            <AddIcon fontSize='inherit' />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            {channels.length > 0 &&
                <Grid item xs={12}>
                    <div className={classes.chips}>
                        {channels.map((channel, i) =>
                            <Chip
                                avatar={<Avatar>{channel.substring(0, 1)}</Avatar>}
                                label={channel}
                                color="primary"
                                onDelete={() => onRemoveChannel(channel)}
                                key={i}
                            />
                        )}
                    </div>
                </Grid>}
        </Grid >
    );
}