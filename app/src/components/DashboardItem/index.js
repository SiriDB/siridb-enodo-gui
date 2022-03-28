import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 300,
        maxWidth: 500
    },
    card: {
        maxHeight: 180,
        padding: theme.spacing(0, 1, 0, 1)
    },
    avatar: {
        color: theme.palette.secondary.main,
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    error: {
        backgroundColor: theme.palette.error.main
    },
    warning: {
        backgroundColor: theme.palette.warning.main
    },
    success: {
        backgroundColor: theme.palette.success.main
    },
    info: {
        backgroundColor: theme.palette.info.main
    },
    divider: {
        marginBottom: theme.spacing(1)
    },
    row: {
        height: 35
    }
}));

function DashboardItem({ title, icon, value, extraInfo, action, status }) {
    const smallScreen = useMediaQuery(theme => theme.breakpoints.down('md'));
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <div className={classes.card}>
                <CardContent>
                    <Grid container justifyContent='space-between'>
                        <Grid item >
                            <Grid container direction='column' >
                                <Typography variant='subtitle1' gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant={!smallScreen ? 'h3' : 'h4'} gutterBottom>
                                    {value}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item >
                            <Avatar
                                className={`${classes[status]} ${classes.avatar}`}
                            >
                                {icon}
                            </Avatar>

                        </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Grid container justifyContent="space-between" alignItems="center" className={classes.row}>
                        <Typography variant="caption" gutterBottom color='textSecondary'>{extraInfo}</Typography>
                        {action ?
                            <IconButton onClick={action} size="small">
                                <NavigateNextIcon />
                            </IconButton> : null}
                    </Grid>
                </CardContent>
            </div>
        </Card >
    );
}

export default DashboardItem;
