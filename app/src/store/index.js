import React from "react";
import globalHook from "use-global-hook";
import io from 'socket.io-client';

import * as actions from "../actions";
import Fetcher from '../util/Fetcher';

const initialState = {
    enodo_clients: {},
    enodo_log: [],
    enodo_status: {},
    enodo_model: [],
    settings: null,
    siridb_status: null,
    series: [],
    job: [],
    event_output: []
};

const useGlobal = globalHook(React, initialState, actions);

const socket = io.connect(process.env.REACT_APP_ENODO_HUB_URI, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket'],
});

socket.emit('authorize', { username: 'enodo', password: 'enodo' });

let socketGlobalActions = {};

socket.on('update', (data) => {
    const resource = data.resource;
    const resourceData = data.resourceData;
    switch (data.updateType) {
        case 'initial':
            socketGlobalActions.__updateStoreValue(resource, resourceData);
            break;
        case 'add':
            socketGlobalActions.__updateStoreValue(resource, resourceData, true);
            break;
        case 'update':
            socketGlobalActions.__updateStoreResourceItem(resource, resourceData.id, resourceData);
            break;
        case 'delete':
            socketGlobalActions.__deleteStoreResourceItem(resource, resourceData);
            break;
        default:
            break;
    }
});

const fetchValueFromREST = (path, cb, resourceName) => {
    Fetcher.fetchResource(path, (data) => {
        cb(resourceName, data);
    })
};

const setup_subscriptions = (globalActions) => {
    socketGlobalActions = globalActions;
    socket.emit('/subscribe/series', {}, (data) => {
        data = JSON.parse(data);
        socketGlobalActions.__updateStoreValue('series', data.data);
    });
    socket.emit('/subscribe/enodo/model', {}, (data) => {
        socketGlobalActions.__updateStoreValue('enodo_model', data.data);
    });
    socket.emit('/subscribe/queue', {}, (data) => {
        data = JSON.parse(data);
        socketGlobalActions.__updateStoreValue('job', data.data);
    });
    socket.emit('/subscribe/event/output', {}, (data) => {
        socketGlobalActions.__updateStoreValue('event_outputs', data.data);
    });
    setInterval(() => {
        fetchValueFromREST('/enodo/status', socketGlobalActions.__updateStoreValue, 'enodo_status');
        fetchValueFromREST('/enodo/clients', socketGlobalActions.__updateStoreValue, 'enodo_clients');
    }, 3000);
};

export { useGlobal, socket, setup_subscriptions };
