import Moment from "moment";
import Paper from "@mui/material/Paper/Paper";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { withVlow } from "vlow";

import BasicPageLayout from "../../components/BasicPageLayout";
import GlobalStore from "../../stores/GlobalStore";

const styles = (theme) => ({
  paper: {
    marginTop: "20px",
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

const NetworkPage = ({ enodo_clients }) => {
  let listeners = [];
  let workers = [];
  if (enodo_clients) {
    listeners = enodo_clients.listeners || [];
    workers = enodo_clients.workers || [];
  }

  return (
    <BasicPageLayout title="Network">
      <TableContainer component={Paper} className={styles.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{"Id"}</TableCell>
              <TableCell>{"Type"}</TableCell>
              <TableCell>{"IP"}</TableCell>
              <TableCell>{"Is busy"}</TableCell>
              <TableCell>{"Last seen"}</TableCell>
              <TableCell>{"Version"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listeners.map((client, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{client.client_id}</TableCell>
                  <TableCell>{"Listener"}</TableCell>
                  <TableCell>{`${client.ip_address[0]} : ${client.ip_address[1]}`}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {Moment.unix(client.last_seen).fromNow()}
                  </TableCell>
                  <TableCell>{client.version}</TableCell>
                </TableRow>
              );
            })}
            {workers.map((client, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{client.client_id}</TableCell>
                  <TableCell>{"Worker"}</TableCell>
                  <TableCell>{`${client.ip_address[0]} : ${client.ip_address[1]}`}</TableCell>
                  <TableCell>{client.busy ? "yes" : "no"}</TableCell>
                  <TableCell>
                    {Moment.unix(client.last_seen).fromNow()}
                  </TableCell>
                  <TableCell>{client.version}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </BasicPageLayout>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["enodo_clients"],
})(NetworkPage);
