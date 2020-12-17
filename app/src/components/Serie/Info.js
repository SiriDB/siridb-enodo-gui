import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useGlobal } from '../../store';

const styles = () => ({
    table: {
        minWidth: 650
    }
});

const Info = (props) => {

    const [globalState] = useGlobal();

    const series = globalState.series;

    let serie = null;
    for (let s in series) {
        if (series[s].name === props.serie) {
            serie = series[s];
        }
    }
    if (serie === null) {
        return <span />;
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
                    <TableCell align="right">{serie.datapoint_count}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">
                        Ignore
                    </TableCell>
                    <TableCell align="right">{serie.ignore ? 'Yes' : 'No'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row">
                        Trend
                    </TableCell>
                    <TableCell align="right">{serie.series_characteristics ? (serie.series_characteristics.trend ? serie.series_characteristics.trend : '') : ''}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

export default Info;
