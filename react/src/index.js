import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import lightGreen from '@material-ui/core/colors/lightGreen';

const theme = createMuiTheme({
    palette: {
        type: 'light',
        contrastThreshold: 3,
        primary: lightGreen,
    },
});

const Index = () => {
    return <MuiThemeProvider theme={theme}>
        <App/>
    </MuiThemeProvider>;
};


ReactDOM.render(<Index/>, document.getElementById('app'));
