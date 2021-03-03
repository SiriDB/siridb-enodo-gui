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

import { VendorNames } from '../../constants/enums';

const styles = () => ({
    table: {
        minWidth: 650
    }
});

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
            <DialogTitle id="alert-dialog-title">{"Output stream info"}</DialogTitle>
            <DialogContent>
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
                            <TableCell align="right">{output.data.rid}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Name
                            </TableCell>
                            <TableCell align="right">{output.data.custom_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Vendor
                            </TableCell>
                            <TableCell align="right">
                                {output.data.vendor_name === VendorNames.SLACK ? 'Slack' : output.data.vendor_name === VendorNames.MS_TEAMS ? 'Microsoft Teams' : output.data.vendor_name === VendorNames.DUTYCALLS ? 'DutyCalls' : output.data.vendor_name === VendorNames.SENTRY ? 'Sentry' : 'Webhook'}
                            </TableCell>
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
                            <TableCell align="right">{JSON.stringify(output.data.headers)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Payload
                            </TableCell>
                            <TableCell align="right">{output.data.payload}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Severity
                            </TableCell>
                            <TableCell align="right">{JSON.stringify(output.data.severity)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Event types
                            </TableCell>
                            <TableCell align="right">{JSON.stringify(output.data.for_event_types)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
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
