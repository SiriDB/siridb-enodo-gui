import Badge from '@material-ui/core/Badge';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import React, { useState, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import WorkOffIcon from '@material-ui/icons/WorkOff';
import { Chart } from "react-google-charts";
import { makeStyles, fade } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import * as ROUTES from '../../constants/routes';
import AddSerie from "../../components/Serie/Add";
import BasicPageLayout from '../../components/BasicPageLayout';
import EditSerie from "../../components/Serie/Edit";
import Info from "../../components/Serie/Info";
import SerieDetails from "../../components/Serie/Dialog";
import { getComparator, stableSort, healthToColor, healthToText } from '../../util/GlobalMethods';
import { useGlobal, socket } from '../../store';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
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
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    health: {
        width: 52
    },
    name: {
        marginBottom: theme.spacing(0.5)
    }
}));

const TimeSeriesPage = () => {
    const classes = useStyles();
    let history = useHistory();

    const [addSerieModalState, setAddSerieModalState] = useState(false);
    const [editSerieModalState, setEditSerieModalState] = useState(false);

    const [chartData, setChartData] = useState([]);
    const [selectedSeriesName, setSelectedSeriesName] = useState("");
    const [viewType, setViewType] = useState("");

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');

    const [referenceObject, setReferenceObject] = useState(null);
    const [selectedSerie, setSelectedSerie] = useState(null);

    const [editedSerie, setEditedSerie] = useState(null);

    const [failedJobs, setFailedJobs] = useState([]);

    const retrieveFailedJobs = () => {
        socket.emit('/api/job/failed', {}, (data) => {
            setFailedJobs(data.data)
        });
    };

    useEffect(() => {
        retrieveFailedJobs();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            retrieveFailedJobs();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const [series] = useGlobal(
        state => state.series
    );

    const _pointWithConditionalAnomaly = (point, anomalies) => {
        if (anomalies !== undefined && anomalies.length) {
            point[3] = null;
        }
        return point;
    };

    const showChart = (series) => {
        socket.emit('/api/series/details', { series_name: series.name }, (data) => {
            const parsed_data = JSON.parse(data).data;

            let points = [];
            if (hasForecast(series)) {
                let history = parsed_data.points;
                for (let i = 0; i < (history.length + parsed_data.forecast_points.length); i++) {
                    if (i < history.length) {
                        points.push(_pointWithConditionalAnomaly([new Date(history[i][0] * 1000), history[i][1], null], parsed_data.anomalies));
                    } else {
                        points.push(_pointWithConditionalAnomaly([new Date(parsed_data.forecast_points[i - history.length][0] * 1000), null, parsed_data.forecast_points[i - history.length][1]], parsed_data.anomalies));
                    }
                }
                for (let i = 0; i < (parsed_data.anomalies.length); i++) {
                    points.push([new Date(parsed_data.anomalies[i][0] * 1000), null, null, parsed_data.anomalies[i][1]]);
                }
            } else {
                let history = parsed_data.points;
                for (let i = 0; i < (history.length); i++) {
                    points.push([new Date(history[i][0] * 1000), history[i][1]]);
                }
            }
            let cData = [hasAnomaliesDetected(series) ? ["x", "data", "forecast", "annomaly"] : hasForecast(series) ? ["x", "data", "forecast"] : ["x", "data"]];
            cData = cData.concat(points);
            setChartData(cData);
            setSelectedSeriesName(series.name);
            setViewType("graph");
        });
    };

    const hasForecast = (series) => {
        return (series.job_statuses.job_forecast !== undefined && series.job_statuses.job_forecast === 3);
        // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

    const hasAnomaliesDetected = (series) => {
        return (series.job_statuses.job_anomaly_detect !== undefined && series.job_statuses.job_anomaly_detect === 3) || (series.job_statuses.job_realtime_anomaly_detect !== undefined && series.job_statuses.job_realtime_anomaly_detect === 3);
        // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
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
        const filtered = failedJobs.filter(fj => fj.series_name === seriesName);
        return filtered.length;
    };

    const navigateToFailedJobs = (seriesName) => {
        history.push({ pathname: ROUTES.FAILED_JOBS, search: `?series=${seriesName}` });
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, series.length - page * rowsPerPage);

    return (
        <BasicPageLayout
            title='Series'
            buttonAction={() => setAddSerieModalState(true)}
            buttonText='Add'
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
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </Toolbar>
                <TableContainer>
                    <Table
                        className={classes.table}
                        size='small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.health} />
                                <TableCell
                                    sortDirection={orderBy === 'name' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'name')}
                                    >
                                        {'Name'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    {'Base analysis'}
                                </TableCell>
                                <TableCell>
                                    {'Forecast'}
                                </TableCell>
                                <TableCell>
                                    {'Anomaly detect'}
                                </TableCell>
                                <TableCell>
                                    {'Static rules'}
                                </TableCell>
                                <TableCell />
                                <TableCell align='right'>
                                    {'Actions'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {series ?
                            <TableBody>
                                {stableSort(
                                    series.filter(s => search ? s.name.toLowerCase().includes(search.toLowerCase()) : true),
                                    getComparator(order, orderBy)
                                ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((series, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={series.rid}
                                            >
                                                <TableCell className={classes.health}>
                                                    <Grid container spacing={1} alignItems='center'>
                                                        <Grid item>
                                                            <Tooltip title={healthToText(series.health / 100) + " health - " + series.health} >
                                                                <FiberManualRecordIcon
                                                                    fontSize="small"
                                                                    style={{ color: healthToColor([0, 1], series.health / 100) }}
                                                                />
                                                            </Tooltip>
                                                        </Grid>
                                                        {series.config.realtime ?
                                                            <Grid item>
                                                                <Tooltip title='Real-time analysis is enabled for this series'>
                                                                    <UpdateIcon color='primary' />
                                                                </Tooltip>
                                                            </Grid>
                                                            : null}
                                                    </Grid>
                                                </TableCell>
                                                <TableCell >
                                                    <div item className={classes.name}>
                                                        {series.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {series.config.job_config.job_base_analysis ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {series.config.job_config.job_forecast ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {series.config.job_config.job_anomaly_detect ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {series.config.job_config.job_static_rules ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell >
                                                    {getNoFailedJobs(series.name) > 0 ?
                                                        <IconButton onClick={() => navigateToFailedJobs(series.name)}>
                                                            <Badge badgeContent={getNoFailedJobs(series.name)} color="error">
                                                                <WorkOffIcon />
                                                            </Badge>
                                                        </IconButton> : null}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={(e) => openMenu(e, series)}
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
                            </TableBody> :
                            <div className="centered-message">No series found</div>}
                    </Table>
                </TableContainer >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={series.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <Popper open={Boolean(referenceObject)} anchorEl={referenceObject} className={classes.popper} placement="left">
                    <Paper>
                        <ClickAwayListener
                            onClickAway={closeMenu}
                        >
                            <MenuList>
                                <MenuItem
                                    onClick={() => {
                                        setViewType('info');
                                        setSelectedSeriesName(selectedSerie.name);
                                        closeMenu();
                                    }}
                                >
                                    <Typography>
                                        {'Show info'}
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        showChart(selectedSerie);
                                        closeMenu();
                                    }}
                                >
                                    <Typography>
                                        {'Show graph'}
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setEditedSerie(selectedSerie);
                                        setEditSerieModalState(true);
                                        closeMenu();
                                    }}
                                >
                                    <Typography>
                                        {'Edit series'}
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        const data = { name: selectedSerie.name };
                                        socket.emit(`/api/series/delete`, data);
                                        closeMenu();
                                    }}
                                >
                                    <Typography color="primary">
                                        {'Delete series'}
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Popper>
            </Paper >
            {viewType === "graph" &&
                <SerieDetails
                    close={() => {
                        setViewType('');
                        setSelectedSeriesName(null);
                    }}
                >
                    <Chart
                        chartType="LineChart"
                        data={chartData}
                        options={{
                            explorer: {
                                actions: ['dragToZoom', 'rightClickToReset'],
                                axis: 'horizontal',
                                keepInBounds: true,
                                maxZoomIn: 4.0
                            },
                            series: {
                                2: { pointShape: 'circle', pointSize: 10, lineWidth: 0 },
                            }
                        }}
                        width="100%"
                        height="400px"
                        legendToggle
                    />
                </SerieDetails>
            }
            {viewType === "info" &&
                <SerieDetails close={() => {
                    setViewType('');
                    setSelectedSeriesName(null);
                }}>
                    <Info serie={selectedSeriesName} />
                </SerieDetails>
            }
            {addSerieModalState &&
                <AddSerie close={() => { setAddSerieModalState(false) }} />
            }
            {editSerieModalState &&
                <EditSerie
                    close={() => {
                        setEditSerieModalState(false);
                        setEditedSerie(null);
                    }}
                    currentSerie={editedSerie}
                />
            }
        </BasicPageLayout >
    );
}

export default TimeSeriesPage;
