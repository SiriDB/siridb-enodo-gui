import React from "react";
import useGlobalHook from "use-global-hook";
import * as actions from "../actions";
import io from 'socket.io-client';
import Fetcher from '../util/Fetcher';

const initialState = {
    enodo_clients: [],
    enodo_log: [],
    enodo_status: {},
    settings: null,
    siridb_status: null,
    series: [],
};

const useGlobal = useGlobalHook(React, initialState, actions);

// const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
const socket = io.connect(`0.0.0.0`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket'],
});

socket.emit('authorize', {username: 'enodo', password: 'enodo'}, (status, data, message) => {

});

let socketGlobalActions = {};

socket.on('*', (data) => {
});

socket.on('series_updates', (data) => {
    data = JSON.parse(data);
    socketGlobalActions.__updateStoreValue('series', data.data);
});

const fetchValueFromREST = (path, cb, resourceName) => {
    Fetcher.fetchResource(path, (data) => {
        cb(resourceName, data);
    })
};


const setup_subscriptions = (globalActions) => {
    socketGlobalActions = globalActions;
    socket.emit('/subscribe/series', {}, (status, data, message) => {

    });
    setInterval(() => {
        fetchValueFromREST('/siridb/status', socketGlobalActions.__updateStoreValue, 'siridb_status');
        fetchValueFromREST('/enodo/status', socketGlobalActions.__updateStoreValue, 'enodo_status');
        fetchValueFromREST('/enodo/log', socketGlobalActions.__updateStoreValue, 'enodo_log');
        fetchValueFromREST('/enodo/clients', socketGlobalActions.__updateStoreValue, 'enodo_clients');
    }, 3000);
};

const publishCreate = (resource, data) => {
    console.log('/publish/' + resource);
    socket.emit('/publish/' + resource, {publish_type: 'create', resource_data: data}, (status, data, message) => {
        console.log(status, data, message);
    });
};

const publishUpdate = (resource, id, data) => {
    console.log('/publish/' + resource);
    socket.emit('/publish/' + resource, {
        publish_type: 'update',
        entity_id: id,
        resource_data: data
    }, (status, data, message) => {
        console.log(status, data, message);
    });
};

export {useGlobal, socket, setup_subscriptions, publishCreate};
