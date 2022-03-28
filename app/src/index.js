import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

import "./index.css";
import App from "./App";

const theme = createTheme({
  palette: {
    type: "light",
    contrastThreshold: 3,
    primary: {
      main: "#09bbad",
      contrastText: "#fff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
