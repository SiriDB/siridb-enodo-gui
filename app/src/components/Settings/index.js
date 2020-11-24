import React, {Component} from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper/Paper";


const classes = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

const styles = theme => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginTop: '20px',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    appBar:
        {
            backgroundColor: '#2862a0'
        }
});

/*
Catergories:
0 = general
1 = source
 */


const Settings = () => {

    let catID = this.props.match.params.catid;

    if (catID === undefined) {
        catID = 0;
    } else {
        catID = parseInt(catID);
    }

    console.log(this.props);
    return (
        <div>

        </div>
    );
}

export default Settings;
