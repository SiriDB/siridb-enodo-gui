import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
