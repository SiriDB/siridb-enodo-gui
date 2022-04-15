import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import { withVlow } from "vlow";

import GlobalStore from "../../stores/GlobalStore";
import { JobTypes } from "../../constants/enums";
import LineChart from "./LineChart";

const SerieDetails = ({ socket, close, seriesName }) => {
  const [seriesDetails, setSeriesDetails] = useState(null);
  const [output, setOutput] = useState(null);
  const [job, setJob] = useState("");
  const [timeunit, setTimeunit] = useState("minute");
  const [forecasts, setForecasts] = useState([]);
  const [socketError, setSocketError] = useState(null);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    socket.emit("/api/series/details", { series_name: seriesName }, (data) => {
      const value = JSON.parse(data);
      if (value.error) {
        setSocketError(value.error);
      } else {
        setSeriesDetails(value.data);
      }
    });
  }, [seriesName, socket]);

  useEffect(() => {
    if (job) {
      if (!job.module_params.forecast_name) {
        socket.emit(
          "/api/siridb/query",
          { query: `select * from '${seriesName}'` },
          (data) => {
            const value = JSON.parse(data);
            if (value.error) {
              setSocketError(value.error);
            } else {
              const res = value.data[Object.keys(value.data)[0]];
              setData(res);
            }
          }
        );
      }
      if (
        (job.job_type === JobTypes.JOB_STATIC_RULES &&
          job.module_params.forecast_name) ||
        job.job_type === JobTypes.JOB_FORECAST
      ) {
        socket.emit(
          "/api/series/forecasts",
          { series_name: seriesName },
          (data) => {
            const value = JSON.parse(data);
            if (value.error) {
              setSocketError(value.error);
            } else {
              const res = value.data[Object.keys(value.data)[0]];
              setForecasts(res);
            }
          }
        );
      }
      if (
        job.job_type === JobTypes.JOB_STATIC_RULES ||
        job.job_type === JobTypes.JOB_ANOMALY_DETECT
      ) {
        const path =
          job.job_type === JobTypes.JOB_STATIC_RULES
            ? "/api/series/static_rules"
            : "/api/series/anomalies";
        socket.emit(path, { series_name: seriesName }, (data) => {
          const value = JSON.parse(data);
          if (value.error) {
            setSocketError(value.error);
          } else {
            const res = value.data[Object.keys(value.data)[0]];
            setOutput(res);
          }
        });
      }
    }
  }, [job, seriesName, socket]);

  useEffect(() => {
    if (output) {
      let cd = [];
      let cl = [];

      if (!job.module_params.forecast_name) {
        cd.push({
          data: data.map((dp) => dp[1]),
          label: "Data",
          borderColor: "#2196f3",
        });
        cl = data.map((d) => d[0]);
      }
      if (
        job.job_type !== JobTypes.JOB_STATIC_RULES ||
        job.module_params.forecast_name
      ) {
        let fd =
          cd.length > 0 ? new Array(cd[0]["data"].length).fill(null) : [];
        cd.push({
          data: fd.concat(forecasts.map((dp) => dp[1])),
          label: "Forecasts",
          borderColor: "#09BBAD",
        });
        cl = cl.concat(forecasts.map((d) => d[0]));
      }
      setChartData(cd);
      setChartLabels(cl);
    }
  }, [output, data, job]);


  const changeJob = (e)=>{
    setData([]);
    setForecasts([]);
    setOutput([]);
    setJob(e.target.value);
  };

  const filteredJobConfigs =
    seriesDetails &&
    seriesDetails.config.job_config.filter((jc) =>
      [
        JobTypes.JOB_FORECAST,
        JobTypes.JOB_ANOMALY_DETECT,
        JobTypes.JOB_STATIC_RULES,
      ].includes(jc.job_type)
    );

  const chartReady =
    job &&
    ((job.job_type === JobTypes.JOB_FORECAST && data.length && forecasts.length) ||
      (job.job_type === JobTypes.JOB_STATIC_RULES && output.length) ||
      (job.job_type === JobTypes.JOB_ANOMALY_DETECT && data.length && output.length));

  console.log(data, forecasts);

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={close}>
      <DialogTitle>{"Series graph"}</DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <DialogContentText sx={{ mb: 2 }}>
          {"Select the desired job:"}
        </DialogContentText>
        {seriesDetails && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{"Job"}</InputLabel>
            <Select
              value={job}
              label="Job"
              onChange={changeJob}
            >
              {filteredJobConfigs.map((jc, i) => (
                <MenuItem key={i} value={jc}>
                  {jc.config_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {job && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{"Job"}</InputLabel>
            <Select
              value={job}
              label="Job"
              onChange={(e) => setJob(e.target.value)}
            >
              {filteredJobConfigs.map((jc, i) => (
                <MenuItem key={i} value={jc}>
                  {jc.config_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {chartReady ? (
          <LineChart
            datasets={chartData}
            labels={chartLabels}
            timeunit="minute"
          />
        ) : job ? (
          <Box sx={{ display: "flex", padding: 5, justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : null}
      </DialogContent>
      {socketError && <Alert severity="error">{socketError}</Alert>}
      <DialogActions>
        <Button onClick={close} color="primary">
          {"Close"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(SerieDetails);
