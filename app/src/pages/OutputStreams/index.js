import DeleteIcon from "@material-ui/icons/Delete"
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InfoIcon from "@material-ui/icons/Info"
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import BasicPageLayout from '../../components/BasicPageLayout';
import OutputDialog from '../../components/Output/Dialog';
import InfoOutputDialog from '../../components/Output/Info';
import { socket } from '../../store';
import { VendorNames } from '../../constants/enums';

const useStyles = makeStyles(() => ({
    paper: {
        minHeight: 93,
        display: 'flex',
        alignItems: 'center'
    }
}));

const OutputStreamsPage = () => {
    const classes = useStyles();
    const [outputStreams, setOutputStreams] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [currentOutput, setCurrentOutput] = useState(null);

    const retrieveOutputStreams = () => {
        socket.emit('/api/event/output', {}, (data) => {
            setOutputStreams(data.data);
        });
    };

    useEffect(() => {
        retrieveOutputStreams();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            retrieveOutputStreams();
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handleClickOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleClickOpenInfoDialog = (output) => {
        setOpenInfoDialog(true);
        setCurrentOutput(output);
    };

    const handleCloseInfoDialog = () => {
        setOpenInfoDialog(false);
        setCurrentOutput(null);
    };

    const handleSubmit = () => {
        retrieveOutputStreams();
        handleCloseAddDialog();
    }

    const deleteOutput = (outputId) => {
        var data = { output_id: outputId };
        socket.emit(`/api/event/output/delete`, data, () => {
            const array = outputStreams.filter((obj) => {
                return obj.output_id !== outputId;
            });
            setOutputStreams(array);
        });
    }

    return (
        <BasicPageLayout title='Output streams' buttonText='Add' buttonAction={() => handleClickOpenAddDialog()}>
            <List style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {outputStreams.length < 1 ? <div className="centered-message">No output streams found</div> : ""}
                {outputStreams &&
                    <Grid container direction='column' spacing={2}>
                        {outputStreams.map((output) => {
                            return (
                                <Grid item key={output.output_id}>
                                    <Paper className={classes.paper} >
                                        <div style={{ padding: "10px 0", flex: 1 }}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <img
                                                        alt={`Avatar ${output.vendor_name}`}
                                                        src={`assets/${output.vendor_name === VendorNames.SLACK ? 'slack_logo' :
                                                            output.vendor_name === VendorNames.MS_TEAMS ? 'ms_teams_logo' :
                                                                output.vendor_name === VendorNames.DUTYCALLS ? 'dc-icon-red' :
                                                                    'webhooks'
                                                            }.png`}
                                                        style={{ width: 32 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={output.custom_name}
                                                    secondary={'Vendor: ' + (output.vendor_name === VendorNames.SLACK ? 'Slack' : output.vendor_name === VendorNames.MS_TEAMS ? 'Microsoft Teams' : output.vendor_name === VendorNames.DUTYCALLS ? 'DutyCalls' : 'Webhook')}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton aria-label="Show info"
                                                        onClick={() => handleClickOpenInfoDialog(output)}
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="Delete" onClick={() => deleteOutput(output.output_id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </div>
                                    </Paper>
                                </Grid>);
                        })}
                    </Grid>}
            </List>
            <OutputDialog open={openAddDialog} handleClose={handleCloseAddDialog} onSubmit={handleSubmit} />
            <InfoOutputDialog open={openInfoDialog} handleClose={handleCloseInfoDialog} output={currentOutput} />
        </BasicPageLayout>
    );
}

export default OutputStreamsPage;
