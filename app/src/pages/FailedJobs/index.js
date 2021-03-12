import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import React, { useEffect, useState } from 'react';
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
import Typography from '@material-ui/core/Typography';
import { Chart } from "react-google-charts";
import { makeStyles, fade } from '@material-ui/core/styles';

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
}));

const FailedJobsPage = () => {
    const classes = useStyles();

    const [openResolveDialog, setOpenResolveDialog] = useState(false);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');

    const [referenceObject, setReferenceObject] = useState(null);
    const [selectedSerie, setSelectedSerie] = useState(null);

    const [failedJobs, setFailedJobs] = useState([]);

    const retrieveFailedJobs = () => {
        socket.emit('/api/job/failed', {}, (data) => {
            console.log(data);
            setFailedJobs(data.data)
        });
    };

    useEffect(() => {
        retrieveFailedJobs();
    }, []);

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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, failedJobs.length - page * rowsPerPage);

    return (
        <BasicPageLayout
            title='Failed jobs'
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
                {/* <TableContainer>
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
                            </TableRow>
                        </TableHead>
                        {series ?
                            <TableBody>
                                {stableSort(
                                    series.filter(s => search ? s.name.toLowerCase().includes(search.toLowerCase()) : true),
                                    getComparator(order, orderBy)
                                ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                </TableContainer > */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={failedJobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper >
            {openResolveDialog &&
                <AddSerie open={openResolveDialog} onClose={() => { setOpenResolveDialog(false) }} />
            }
        </BasicPageLayout >
    );
}

export default FailedJobsPage;
