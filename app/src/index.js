import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";

import "./index.css";
import App from "./App";

const theme = createTheme(adaptV4Theme({
  palette: {
    mode: "light",
    contrastThreshold: 3,
    primary: {
      main: "#09bbad",
      contrastText: "#fff",
    },
  },
}));

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
