import React, { useState, useEffect } from 'react';
import DeleteIcon from "@material-ui/icons/Delete"
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InfoIcon from "@material-ui/icons/Info"
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Paper from '@material-ui/core/Paper';

import BasicPageLayout from '../../components/BasicPageLayout';
import OutputDialog from '../../components/Output/Dialog';
import { socket } from '../../store';

const styles = theme => ({
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
});

const OutputStreamsPage = () => {
    const [outputStreams, setOutputStreams] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSubmit = () => {
        retrieveOutputStreams();
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
        <BasicPageLayout title='Output Streams' buttonText='Add' buttonAction={() => handleClickOpen()}>
            <List style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {outputStreams.length < 1 ? <div className="centered-message">No output streams found</div> : ""}
                {outputStreams &&
                    <Grid container direction='column' spacing={2}>
                        {outputStreams.map((output) => {
                            return (
                                <Grid item key={output.output_id}>
                                    <Paper className={styles.paper} >
                                        <div style={{ padding: "10px 0" }}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={'ID: ' + output.output_id}
                                                    secondary={'Type: ' + output.output_type}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton aria-label="Show info"
                                                    // onClick={() => {
                                                    //     setViewType('info');
                                                    //     setSelectedSerie(output.output_id);
                                                    // }}
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
            <OutputDialog open={openDialog} handleClose={handleClose} onSubmit={handleSubmit} />
        </BasicPageLayout>
    );
}

export default OutputStreamsPage;
