import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { withVlow } from "vlow";

import { healthToColor } from "../../util/GlobalMethods";
import GlobalStore from "../../stores/GlobalStore";

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
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const Info = ({ series, ...props }) => {

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
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={closeCb}>
      <DialogTitle>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          style={{ height: 55 }}
        >
          <Grid item>{"Series info"}</Grid>
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography gutterBottom>{"Health: "}</Typography>
              </Grid>
              <Grid item>
                <CircularProgressWithLabel
                  value={serie.state.health}
                  style={{ color: healthToColor([0, 1], serie.state.health / 100) }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow></TableRow>
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
                Datapoints
              </TableCell>
              <TableCell align="right">
                {serie.state.datapoint_count ? serie.state.datapoint_count : "?"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Ignore
              </TableCell>
              <TableCell align="right">{serie.ignore ? "Yes" : "No"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Trend
              </TableCell>
              <TableCell align="right">
                {serie.series_characteristics &&
                serie.series_characteristics.trend
                  ? serie.series_characteristics.trend
                  : "?"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCb} color="primary">
          {"Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["series"],
})(Info);
