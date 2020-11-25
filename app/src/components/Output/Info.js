import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = () => ({
    table: {
        minWidth: 650
    }
});

const outputNames = {
    1: 'Generic Webhook',
    2: 'Slack',
    3: 'Microsoft Teams',
    4: 'DutyCalls',
    5: 'Sentry'
};

const Info = ({ output, open, handleClose }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='md'
        >
            <DialogTitle id="alert-dialog-title">{"Output Stream Info"}</DialogTitle>
            <DialogContent>
                {output &&
                <Table className={styles.table}>
                    <TableHead>
                        <TableRow>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Id
                            </TableCell>
                            <TableCell align="right">{output.output_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Type
                            </TableCell>
                            <TableCell align="right">{outputNames[output.output_type]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                URL
                            </TableCell>
                            <TableCell align="right">{output.data.url}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Headers
                            </TableCell>
                            <TableCell align="right">{String(output.data.headers)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Payload
                            </TableCell>
                            <TableCell align="right">{output.data.payload}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Severities
                            </TableCell>
                            <TableCell align="right">{String(output.for_severities)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Event types
                            </TableCell>
                            <TableCell align="right">{String(output.for_event_types)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    {'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Info;
