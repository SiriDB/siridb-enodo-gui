import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";
import { withVlow } from "vlow";


import GlobalActions from "../../actions/GlobalActions";
import GlobalStore from "../../stores/GlobalStore";

const useStyles = makeStyles((theme) => ({
  styledMain: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      height: "100vh",
      width: "100vw",
    },
  },
  styledBox: {
    padding: theme.spacing(10, 4),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(5),
    },
    textAlign: "center",
  },
  styledTypography: {
    marginBottom: theme.spacing(5),
  },
  logo: {
    width: 160,
    height: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  smallBox: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
  },
}));

function SignInPage({ socket }) {
  const classes = useStyles();
  const bigScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const [alertText, setAlertText] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    socket.emit(
      "authorize",
      { username: username, password: password },
      (data) => {
        if (data === true) {
          setAlertText(null);
          // Save credentials to sessionStorage
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("password", password);
          GlobalActions.updateStoreValue("authenticated", true);
        } else {
          setAlertText("Invalid credentials provided");
        }
      }
    );
  };

  const onChange = ({ target }) => {
    if (target.name === "username") {
      setUsername(target.value);
    } else if (target.name === "password") {
      setPassword(target.value);
    }
  };

  const isInvalid = password === "" || username === "";

  const content = (
    <Fragment>
      <Box className={classes.styledBox}>
        <img src="assets/icon.png" alt="logo" className={classes.logo} />
        <Hidden xlDown>
          <Typography variant="h3" gutterBottom>
            {"Welcome to Enodo"}
          </Typography>
        </Hidden>
        <Hidden xlUp>
          <Typography variant="h4" gutterBottom>
            {"Welcome to Enodo"}
          </Typography>
        </Hidden>
        <Typography
          className={classes.styledTypography}
          variant="subtitle1"
          gutterBottom
        >
          {"Gain insights into your data"}
        </Typography>
        <Grid container spacing={1} justifyContent="center" direction="column">
          <Grid item>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
              direction="row"
            >
              <Grid item xs={12}>
                <TextField
                  name="username"
                  value={username}
                  onChange={onChange}
                  label="Username"
                  type="text"
                  variant="outlined"
                  placeholder="Username"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  value={password}
                  onChange={onChange}
                  label="Password"
                  type="password"
                  variant="outlined"
                  placeholder="Password"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isInvalid) {
                      onSubmit();
                    }
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={isInvalid}
                  onClick={onSubmit}
                  color="primary"
                  disableElevation
                  fullWidth
                  className={classes.button}
                >
                  {"Sign In"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {alertText && <Alert severity="error">{alertText}</Alert>}
    </Fragment>
  );

  if (bigScreen) {
    return (
      <main className={classes.styledMain}>
        <Paper style={{ maxWidth: 550, flex: 1 }}>{content}</Paper>
      </main>
    );
  } else {
    return (
      <main className={classes.styledMain}>
        <Box className={classes.smallBox}>{content}</Box>
      </main>
    );
  }
}

export default withVlow({
  store: GlobalStore,
  keys: ["socket"],
})(SignInPage);
