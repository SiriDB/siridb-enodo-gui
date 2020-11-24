import Grid from '@material-ui/core/Grid';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    textField: {
        width: 500
    }
}));

export default function EnterUrl({ setUrl }) {
    const classes = useStyles();

    const handleChange = (e) => {
        setUrl(e.target.value);
    };


    );
}