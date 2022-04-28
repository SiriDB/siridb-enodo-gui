import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import MoreIcon from "@mui/icons-material/MoreVert";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import React, { useState, useEffect, useCallback } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import moment from "moment";
import { alpha } from "@mui/material/styles";
import { withVlow } from "vlow";

import AddLabelDialog from "../../components/Labels/AddLabelDialog";
import BasicPageLayout from "../../components/BasicPageLayout";
import ConfigDialog from "../../components/Labels/ConfigDialog";
import DeleteLabelDialog from "../../components/Labels/DeleteLabelDialog";
import GlobalStore from "../../stores/GlobalStore";
import { getComparator, stableSort } from "../../util/GlobalMethods";

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
}));

const LabelsPage = ({ socket }) => {
  const classes = useStyles();

  const [addLabelModalState, setAddLabelModalState] = useState(false);
  const [infoLabelModalState, setInfoLabelModalState] = useState(false);
  const [deleteLabelModalState, setDeleteLabelModalState] = useState(false);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const [referenceObject, setReferenceObject] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const [lastUpdate, setLastUpdate] = useState(null);
  const [labels, setLabels] = useState([]);

  const retrieveLabels = useCallback(() => {
    socket.emit("/api/enodo/labels", {}, (data) => {
      setLastUpdate(data.data.last_update);
      setLabels(data.data.labels);
    });
  }, [socket]);

  useEffect(() => {
    retrieveLabels();
  }, [retrieveLabels]);

  useEffect(() => {
    const interval = setInterval(() => {
      retrieveLabels();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [retrieveLabels]);

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

  const openMenu = (event, label) => {
    label.config = label.series_config;
    setSelectedLabel(label);
    setReferenceObject(event.currentTarget);
  };

  const closeMenu = () => {
    setReferenceObject(null);
  };

  const closeAddDialog = () => {
    setAddLabelModalState(false);
    setSelectedLabel(null);
    retrieveLabels();
  };

  const closeInfoDialog = () => {
    setInfoLabelModalState(false);
    setSelectedLabel(null);
  };

  const closeDeleteDialog = () => {
    setDeleteLabelModalState(false);
    setSelectedLabel(null);
    retrieveLabels();
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, labels.length - page * rowsPerPage);

  return (
    <BasicPageLayout
      title="Labels"
      buttonAction={() => setAddLabelModalState(true)}
      buttonText="Add"
      titleButton={
        <IconButton aria-label="refresh" size="small" onClick={retrieveLabels}>
          <RefreshIcon />
        </IconButton>
      }
    >
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography>
                {"Last update: " +
                  (lastUpdate
                    ? moment.unix(lastUpdate).format("YYYY-MM-DD HH:mm")
                    : "unknown")}
              </Typography>
            </Grid>
            <Grid item className={classes.search}>
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
            </Grid>
          </Grid>
        </Toolbar>
        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === "name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "name")}
                  >
                    {"Name"}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "description" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "description")}
                  >
                    {"Description"}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "selector" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "selector"}
                    direction={orderBy === "selector" ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, "selector")}
                  >
                    {"Selector"}
                  </TableSortLabel>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(
                labels.filter((s) =>
                  search
                    ? s.name.toLowerCase().includes(search.toLowerCase())
                    : true
                ),
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((label, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>{label.name}</TableCell>
                      <TableCell>{label.description}</TableCell>
                      <TableCell>{label.selector}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          onClick={(e) => openMenu(e, label)}
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
          count={labels.length}
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
                    setInfoLabelModalState(true);
                    closeMenu();
                  }}
                >
                  <Typography>{"View config"}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDeleteLabelModalState(true);
                    closeMenu();
                  }}
                >
                  <Typography color="error">{"Delete label"}</Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Paper>
      {addLabelModalState && <AddLabelDialog handleClose={closeAddDialog} />}
      {infoLabelModalState && (
        <ConfigDialog handleClose={closeInfoDialog} label={selectedLabel} />
      )}
      <DeleteLabelDialog
        open={deleteLabelModalState}
        handleClose={closeDeleteDialog}
        selectedLabel={selectedLabel}
      />
    </BasicPageLayout>
  );
};

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(LabelsPage);
