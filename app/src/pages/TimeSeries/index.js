import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { Chart } from "react-google-charts";
import { makeStyles } from '@material-ui/core/styles';

import AddSerie from "../../components/Serie/Add";
import EditSerie from "../../components/Serie/Edit";
import BasicPageLayout from '../../components/BasicPageLayout';
import Info from "../../components/Serie/Info";
import SerieDetails from "../../components/Serie/Dialog";
import { getComparator, stableSort } from '../../util/GlobalMethods';
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
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    popper: {
        zIndex: 1500,
    }
}));

const TimeSeriesPage = () => {
    const classes = useStyles();

    const [addSerieModalState, setAddSerieModalState] = useState(false);
    const [editSerieModalState, setEditSerieModalState] = useState(false);

    const [chartData, setChartData] = useState([]);
    const [selectedSerieName, setSelectedSerieName] = useState("");
    const [viewType, setViewType] = useState("");

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [referenceObject, setReferenceObject] = useState(null);
    const [selectedSerie, setSelectedSerie] = useState(null);

    const [editedSerie, setEditedSerie] = useState(null);

    const [series] = useGlobal(
        state => state.series
    );

    const _pointWithConditionalAnomaly = (point, anomalies) => {
        if (anomalies !== undefined && anomalies.length) {
            point[3] = null;
        }
        return point;
    };

    const showChart = (serie) => {
        socket.emit('/api/series/details', { series_name: serie.name }, (data) => {
            const parsed_data = JSON.parse(data).data;

            let points = [];
            if (hasForecast(serie)) {
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
            let cData = [hasAnomaliesDetected(serie) ? ["x", "data", "forecast", "annomaly"] : hasForecast(serie) ? ["x", "data", "forecast"] : ["x", "data"]];
            cData = cData.concat(points);
            setChartData(cData);
            setSelectedSerieName(serie.name);
            setViewType("graph");
        });
    };

    const hasForecast = (serie) => {
        return (serie.job_statuses.job_forecast !== undefined && serie.job_statuses.job_forecast === 3);
        // && serie.job_statuses.job_forecast === 3 && serie.job_statuses.job_anomaly_detect === 3)
    };

    const hasAnomaliesDetected = (serie) => {
        return (serie.job_statuses.job_anomaly_detect !== undefined && serie.job_statuses.job_anomaly_detect === 3) || (serie.job_statuses.job_realtime_anomaly_detect !== undefined && serie.job_statuses.job_realtime_anomaly_detect === 3);
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

    const openMenu = (event, serie) => {
        setSelectedSerie(serie);
        setReferenceObject(event.currentTarget);
    };

    const closeMenu = () => {
        setSelectedSerie(null);
        setReferenceObject(null);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, series.length - page * rowsPerPage);

    return (
        <BasicPageLayout
            title='Series'
            buttonAction={() => setAddSerieModalState(true)}
            buttonText='Add'
        >
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        size='medium'
                    >
                        <TableHead>
                            <TableRow>
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
                                <TableCell align='right'>
                                    {'Actions'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {series ?
                            <TableBody>
                                {stableSort(series, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((serie, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={serie.rid}
                                            >
                                                <TableCell >
                                                    {serie.name}
                                                </TableCell>
                                                <TableCell>
                                                    {serie.config.job_config.job_base_analysis ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {serie.config.job_config.job_forecast ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {serie.config.job_config.job_anomaly_detect ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell>
                                                    {serie.config.job_config.job_static_rules ?
                                                        <CheckCircleIcon color='primary' /> : <CancelIcon color='error' />}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={(e) => openMenu(e, serie)}
                                                    >
                                                        <MoreIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={7} />
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
                                        setSelectedSerieName(selectedSerie.name);
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
                                        {'Edit serie'}
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
                                        {'Delete serie'}
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
                        setSelectedSerieName(null);
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
                    setSelectedSerieName(null);
                }}>
                    <Info serie={selectedSerieName} />
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
