import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import TimelineIcon from '@material-ui/icons/Timeline';
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import List from "@material-ui/core/List/List";
import {useGlobal} from './store';

import moment from 'moment';

const EventLogList = () => {

    const [globalState, globalActions] = useGlobal();
    const enodo_log = globalState.enodo_log;

    return (
        <List>
            {enodo_log.map((line, i) => {
                let date = moment(line.datetime).format('YYYY-MM-DD H:mm:ss');
                return <ListItem key={i}>
                    <ListItemIcon><TimelineIcon/></ListItemIcon>
                    <ListItemText
                        primary={`${moment.duration(moment().diff(date)).humanize()} ago - ${line.serie_name} - ${line.message}`}/>
                </ListItem>
            })}
        </List>
    );
}

export default EventLogList;
