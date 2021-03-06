import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Moment from 'moment';
import Paper from '@material-ui/core/Paper';
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
import { makeStyles, fade } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import BasicPageLayout from '../../components/BasicPageLayout';
import ResolveDialog from "../../components/FailedJobs/ResolveDialog";
import { getComparator, stableSort, historyGetQueryParam } from '../../util/GlobalMethods';
import { socket } from '../../store';

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
    let history = useHistory();

    const [openResolveDialog, setOpenResolveDialog] = useState(false);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');

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

    useEffect(() => {
        const param = historyGetQueryParam(history, 'series');
        if (param) {
            setSearch(param);
        }
    }, [history]);

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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, failedJobs.length - page * rowsPerPage);

    return (
        <BasicPageLayout
            title='Failed jobs'
        >
            <Paper className={classes.paper}>
                <Toolbar>
                    <Button
                        variant='contained'
                        disableElevation
                        color='primary'
                        onClick={() => setOpenResolveDialog(true)}
                        disabled={failedJobs.length === 0}
                    >
                        {'Resolve'}
                    </Button>
                    <div className={classes.grow} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search by series name…"
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
                        size='medium'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sortDirection={orderBy === 'rid' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'rid'}
                                        direction={orderBy === 'rid' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'rid')}
                                    >
                                        {'Id'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={orderBy === 'job_type' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'job_type'}
                                        direction={orderBy === 'job_type' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'job_type')}
                                    >
                                        {'Job type'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={orderBy === 'series_name' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'series_name'}
                                        direction={orderBy === 'series_name' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'series_name')}
                                    >
                                        {'Series name'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={orderBy === 'send_at' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'send_at'}
                                        direction={orderBy === 'send_at' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'send_at')}
                                    >
                                        {'Send at'}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell
                                    sortDirection={orderBy === 'worker_id' ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === 'worker_id'}
                                        direction={orderBy === 'worker_id' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'worker_id')}
                                    >
                                        {'Worker id'}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {failedJobs ?
                            <TableBody>
                                {stableSort(
                                    failedJobs.filter(j => search ? j.series_name.toLowerCase().includes(search.toLowerCase()) : true),
                                    getComparator(order, orderBy)
                                ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((job, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={job.rid}
                                            >
                                                <TableCell >
                                                    {job.rid}
                                                </TableCell>
                                                <TableCell>
                                                    {job.job_type}
                                                </TableCell>
                                                <TableCell>
                                                    {job.series_name}
                                                </TableCell>
                                                <TableCell>
                                                    {Moment.unix(job.send_at).format('YYYY-MM-DD HH:mm')}
                                                </TableCell>
                                                <TableCell>
                                                    {job.worker_id}
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
                            <div className="centered-message">No failed jobs found</div>}
                    </Table>
                </TableContainer >
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
            <ResolveDialog
                open={openResolveDialog}
                onClose={() => {
                    setOpenResolveDialog(false);
                    retrieveFailedJobs();
                }}
                failedJobs={failedJobs}
            />
        </BasicPageLayout >
    );
}

export default FailedJobsPage;
