import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';

import BasicPageLayout from '../../components/BasicPageLayout';
import Moment from 'moment';
import Paper from "@material-ui/core/Paper/Paper";
import { useGlobal } from '../../store';

const styles = theme => ({
    paper: {
        marginTop: '20px',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});

const NetworkPage = () => {

    const [enodo_clients, set_enodo_clients] = useGlobal(
        state => state.enodo_clients,
        actions => null
    );

    let listeners = [];
    let workers = [];
    if (enodo_clients) {
        listeners = enodo_clients.listeners || [];
        workers = enodo_clients.workers || [];
    }

    return (
        <BasicPageLayout title='Network'>
            <TableContainer component={Paper} className={styles.paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>IP</TableCell>
                            <TableCell>Is busy</TableCell>
                            <TableCell>Last seen</TableCell>
                            <TableCell>Version</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listeners.map((client, i) => {
                            return <TableRow key={i}>
                                <TableCell>{client.client_id}</TableCell>
                                <TableCell>Listener</TableCell>
                                <TableCell>{`${client.ip_address[0]} : ${client.ip_address[1]}`}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>{Moment.unix(client.last_seen).fromNow()}</TableCell>
                                <TableCell>{client.version}</TableCell>
                            </TableRow>
                        })}
                        {workers.map((client, i) => {
                            return <TableRow key={i}>
                                <TableCell>{client.client_id}</TableCell>
                                <TableCell>Worker</TableCell>
                                <TableCell>{`${client.ip_address[0]} : ${client.ip_address[1]}`}</TableCell>
                                <TableCell>{client.busy ? "yes" : "no"}</TableCell>
                                <TableCell>{Moment.unix(client.last_seen).fromNow()}</TableCell>
                                <TableCell>{client.version}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </BasicPageLayout>
    );
}

export default NetworkPage;
