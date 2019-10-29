import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const Index = () => {
    return <MuiThemeProvider theme={theme}>
        <App/>
    </MuiThemeProvider>;
};


ReactDOM.render(<Index/>, document.getElementById('app'));
