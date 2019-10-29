import React, {Component} from 'react';
import {useGlobal} from '../store';


const statusBarStyle = {
    width: "calc(100% - 400px)",
    position: "fixed",
    bottom: 0,
    left: 0,
    backgroundColor: "#424242",
    paddingRight: "10px"
};

const statusBarItem = {
    float: 'right',
    color: 'white'
};

const StatusBar = () => {

    const [globalState, globalActions] = useGlobal();

    const enodo_status = globalState.enodo_status;

    return <div style={statusBarStyle}>
        <div style={statusBarItem}>
            CPU: {enodo_status.cpu_usage}
        </div>
    </div>;
};

export default StatusBar;
