import React, {Component} from 'react';
// import ReactPubSubStore from 'react-pubsub-store';
//
// import RepoGrid from "./RepoGrid";
// import Fetcher from './util/Fetcher';

import { Link } from 'react-router-dom'

const menuStyle = {
    maxWidth: "300px",
    maxHeight: "500px",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto"
};

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron" style={menuStyle}>
                    <ul style={{listStyle: "none", textAlign: "center", padding: 0}}>
                        <li><Link to="/series">Time series</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Menu;
