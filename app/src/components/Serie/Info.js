import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { useGlobal } from '../../store';
import { healthToColor } from '../../util/GlobalMethods';

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" size={40} {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">
                    {`${Math.round(props.value,)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

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

    const closeCb = props.close;

    return (
        <Dialog
            fullWidth={true}
            maxWidth='lg'
            open={true}
            onClose={closeCb}
        >
            <DialogTitle>
                <Grid container justify='space-between' spacing={2} style={{ height: 55 }}>
                    <Grid item>
                        {'Series info'}
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} alignItems='center'>
                            <Grid item>
                                <Typography gutterBottom>
                                    {'Health: '}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <CircularProgressWithLabel value={serie.health} style={{ color: healthToColor([0, 1], serie.health / 100) }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Table>
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
                                Initially analyzed
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
                            <TableCell align="right">{serie.series_characteristics && serie.series_characteristics.trend ? serie.series_characteristics.trend : '?'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCb} color="primary">
                    {'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Info;
