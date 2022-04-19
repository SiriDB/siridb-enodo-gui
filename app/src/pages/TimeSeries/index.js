import Badge from "@mui/material/Badge";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton/IconButton";
import InputBase from "@mui/material/InputBase";
import LabelIcon from "@mui/icons-material/Label";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import MoreIcon from "@mui/icons-material/MoreVert";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import React, { useState, useEffect, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import UpdateIcon from "@mui/icons-material/Update";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import makeStyles from "@mui/styles/makeStyles";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { withVlow } from "vlow";

import * as ROUTES from "../../constants/routes";
import AddSerie from "../../components/Serie/Add";
import BasicPageLayout from "../../components/BasicPageLayout";
import EditSerie from "../../components/Serie/Edit";
import InfoDialog from "../../components/Serie/Info";
import SerieDetails from "../../components/Serie/ChartsDialog";
import {
  getComparator,
  stableSort,
  healthToColor,
  healthToText,
} from "../../util/GlobalMethods";
import GlobalStore from "../../stores/GlobalStore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  popper: {
    zIndex: 1500,
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  health: {
    width: 90,
  },
  name: {
    marginBottom: theme.spacing(0.5),
  },
}));

const TimeSeriesPage = ({ series, socket }) => {
  const classes = useStyles();
  let navigate = useNavigate();

  const [addSerieModalState, setAddSerieModalState] = useState(false);
  const [editSerieModalState, setEditSerieModalState] = useState(false);

  const [selectedSeriesName, setSelectedSeriesName] = useState("");
  const [viewType, setViewType] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const [referenceObject, setReferenceObject] = useState(null);
  const [selectedSerie, setSelectedSerie] = useState(null);

  const [editedSerie, setEditedSerie] = useState(null);

  const [failedJobs, setFailedJobs] = useState([]);

  const retrieveFailedJobs = useCallback(() => {
    socket.emit("/api/job/failed", {}, (data) => {
      setFailedJobs(data.data);
    });
  }, [socket]);

  useEffect(() => {
    retrieveFailedJobs();
  }, [retrieveFailedJobs]);

  useEffect(() => {
    const interval = setInterval(() => {
      retrieveFailedJobs();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [retrieveFailedJobs]);

  const showChart = (series) => {
    setSelectedSeriesName(series.name);
    setViewType("graph");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openMenu = (event, series) => {
    setSelectedSerie(series);
    setReferenceObject(event.currentTarget);
  };

  const closeMenu = () => {
    setSelectedSerie(null);
    setReferenceObject(null);
  };

  const getNoFailedJobs = (seriesName) => {
    const filtered = failedJobs.filter((fj) => fj.series_name === seriesName);
    return filtered.length;
  };

  const navigateToFailedJobs = (seriesName) => {
    navigate({ pathname: ROUTES.FAILED_JOBS, search: `?series=${seriesName}` });
  };

  const closeChartsDialog = () => {
    setViewType("");
    setSelectedSeriesName(null);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, series.length - page * rowsPerPage);

  return (
    <BasicPageLayout
      title="Series"
      buttonAction={() => setAddSerieModalState(true)}
      buttonText="Add"
    >
      <Paper className={classes.paper}>
        <Toolbar>
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search by name…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Toolbar>
        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.health} />
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "name")}
                  >
                    {"Name"}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "datapoint_count"}
                    direction={orderBy === "datapoint_count" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "datapoint_count")}
                  >
                    {"No. datapoints"}
                  </TableSortLabel>
                </TableCell>
                <TableCell>{"No. jobs"}</TableCell>
                <TableCell />
                <TableCell align="right">{"Actions"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(
                series.filter((s) =>
                  search
                    ? s.name.toLowerCase().includes(search.toLowerCase())
                    : true
                ),
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((series, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={series.rid}>
                      <TableCell className={classes.health}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item>
                            <Tooltip
                              title={
                                series.health === null
                                  ? "unknown"
                                  : healthToText(series.health / 100) +
                                    " health - " +
                                    series.health +
                                    "%"
                              }
                            >
                              <FiberManualRecordIcon
                                fontSize="small"
                                style={{
                                  color:
                                    series.health === null
                                      ? "#D1D1D1"
                                      : healthToColor(
                                          [0, 1],
                                          series.health / 100
                                        ),
                                }}
                              />
                            </Tooltip>
                          </Grid>
                          {series.config.realtime ? (
                            <Grid item>
                              <Tooltip title="Real-time analysis is enabled for this series">
                                <UpdateIcon color="primary" />
                              </Tooltip>
                            </Grid>
                          ) : null}
                          {series.label_name ? (
                            <Grid item>
                              <Tooltip
                                title={`This series is added on basis of the label '${series.label_name}'`}
                              >
                                <LabelIcon color="primary" />
                              </Tooltip>
                            </Grid>
                          ) : null}
                        </Grid>
                      </TableCell>
                      <TableCell>
                        <div className={classes.name}>{series.name}</div>
                      </TableCell>
                      <TableCell>
                        {series.datapoint_count ? series.datapoint_count : "?"}
                      </TableCell>
                      <TableCell>{series.config.job_config.length}</TableCell>
                      <TableCell>
                        {getNoFailedJobs(series.name) > 0 ? (
                          <IconButton
                            onClick={() => navigateToFailedJobs(series.name)}
                            size="large"
                          >
                            <Badge
                              badgeContent={getNoFailedJobs(series.name)}
                              color="error"
                            >
                              <WorkOffIcon />
                            </Badge>
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          onClick={(e) => openMenu(e, series)}
                          size="large"
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={series.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Popper
          open={Boolean(referenceObject)}
          anchorEl={referenceObject}
          className={classes.popper}
          placement="left"
        >
          <Paper>
            <ClickAwayListener onClickAway={closeMenu}>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setViewType("info");
                    setSelectedSeriesName(selectedSerie.name);
                    closeMenu();
                  }}
                >
                  <Typography>{"Show info"}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    showChart(selectedSerie);
                    closeMenu();
                  }}
                >
                  <Typography>{"Show graphs"}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setEditedSerie(selectedSerie);
                    setEditSerieModalState(true);
                    closeMenu();
                  }}
                >
                  <Typography>{"Edit series"}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    const data = { name: selectedSerie.name };
                    socket.emit(`/api/series/delete`, data);
                    closeMenu();
                  }}
                >
                  <Typography color="error">{"Delete series"}</Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Paper>
      {viewType === "graph" && (
        <SerieDetails
          close={closeChartsDialog}
          seriesName={selectedSeriesName}
        />
      )}
      {viewType === "info" && (
        <InfoDialog
          close={() => {
            setViewType("");
            setSelectedSeriesName(null);
          }}
          serie={selectedSeriesName}
        />
      )}
      {addSerieModalState && (
        <AddSerie
          close={() => {
            setAddSerieModalState(false);
          }}
        />
      )}
      {editSerieModalState && (
        <EditSerie
          close={() => {
            setEditSerieModalState(false);
            setEditedSerie(null);
          }}
          currentSerie={editedSerie}
        />
      )}
    </BasicPageLayout>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["series", "socket"],
})(TimeSeriesPage);
