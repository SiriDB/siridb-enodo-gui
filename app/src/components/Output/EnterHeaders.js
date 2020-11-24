import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete"
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default function EnterHeaders({ headers, setHeaders }) {
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
        console.log(object)
    }

    const handleDeleteHeader = (key) => {
        let object = { ...headers };
        delete object[key];
        setHeaders(object);
    }

    return (
        <Grid container spacing={2}>
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
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            defaultValue={value}
                            onChange={handleChangeValue}
                            label='Value'
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={handleAddHeader}
                            color='primary'
                            disabled={key === '' || value === ''}
                        >
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
                                        <IconButton aria-label="Delete" onClick={() => handleDeleteHeader(key)}>
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