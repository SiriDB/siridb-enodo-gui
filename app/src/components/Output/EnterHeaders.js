import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete"
import Grid from '@mui/material/Grid';
import IconButton from "@mui/material/IconButton/IconButton";
import Paper from '@mui/material/Paper';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
    root: {
        height: 300,
        overflow: 'auto'
    }
}));

export default function EnterHeaders({ headers, setHeaders }) {
    const classes = useStyles();

    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const handleChangeKey = (e) => {
        setKey(e.target.value);
    };

    const handleChangeValue = (e) => {
        setValue(e.target.value);
    };

    const handleAddHeader = () => {
        let object = { ...headers };
        object[key] = value;
        setHeaders(object);
    }

    const handleDeleteHeader = (key) => {
        let object = { ...headers };
        delete object[key];
        setHeaders(object);
    }

    return (
        <Grid container alignContent='flex-start' spacing={2} className={classes.root}>
            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {'Please enter the headers which should be included in the event update:'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container direction='row' spacing={2}>
                    <Grid item>
                        <TextField
                            defaultValue={key}
                            onChange={handleChangeKey}
                            label='Key'
                            variant="outlined"
                            type="text"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            defaultValue={value}
                            onChange={handleChangeValue}
                            label='Value'
                            variant="outlined"
                            type="text"
                        />
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={handleAddHeader}
                            color='primary'
                            disabled={key === '' || value === ''}
                            size="large">
                            <AddIcon fontSize='inherit' />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TableContainer variant='outlined' component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{'Key'}</TableCell>
                                <TableCell>{'Value'}</TableCell>
                                <TableCell align='right' />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(headers).map(key =>
                                <TableRow key={key}>
                                    <TableCell component="th" scope="row">
                                        {key}
                                    </TableCell>
                                    <TableCell>
                                        {headers[key]}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="Delete" onClick={() => handleDeleteHeader(key)} size="large">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid >
    );
}