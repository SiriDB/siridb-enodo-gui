import React, {Component} from 'react';

import {Link} from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {useGlobal} from '../store';

const menuStyle = {
    maxWidth: "300px",
    maxHeight: "500px",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto"
};

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const Info = (props) => {

    const [globalState, globalActions] = useGlobal();

    const series = globalState.series;

    let serie = null;
    for (let s in series) {
        if (series[s].name === props.serie) {
            serie = series[s];
        }
    }
    if (serie === null) {
        return <span/>;
    }

    return (
        <Table className={styles.table}>
            <TableHead>
                <TableRow>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row">
                        Name
                    </TableCell>
                    <TableCell align="right">{serie.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">
                        Is Analysed
                    </TableCell>
                    <TableCell align="right">{serie.analysed ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">
                        Datapoints
                    </TableCell>
                    <TableCell align="right">{serie.data_points}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

export default Info;
