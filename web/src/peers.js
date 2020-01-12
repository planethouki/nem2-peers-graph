/* global env */
import 'bootstrap';
import './common.js';
import './style.scss';
const Tabulator = require('tabulator-tables');

env.getPeersData()
    .then((peers) => {
        const tableData = Object.keys(peers).map((publicKey) => {
            const peer = peers[publicKey]
            return {
                id: publicKey,
                version: peer.version,
                publicKey: peer.publicKey,
                roles: peer.roles,
                port: peer.port,
                networkIdentifier: peer.networkIdentifier,
                host: peer.host,
                friendlyName: peer.friendlyName,
            }
        });
        const columns = [
            { title: 'Name', field: 'friendlyName' },
            { title: 'Host', field: 'host'},
            { title: 'Port', field: 'port' },
            { title: 'Ver', field: 'version' },
            { title: 'Roles', field: 'roles' },
            { title: 'NW', field: 'networkIdentifier'},
            { title: 'Public Key', field: 'publicKey' }
        ]
        const table = new Tabulator("#nodes-table", {
            data: tableData,
            columns,
        });

    });