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
                peersCount: peer.peers.length
            }
        });
        const columns = [
            { title: 'Name', field: 'friendlyName' },
            { title: 'Host', field: 'host' },
            { title: 'Port', field: 'port' },
            { title: 'Ver', field: 'version' },
            { title: 'Roles', field: 'roles' },
            { title: 'NW', field: 'networkIdentifier' },
            { title: 'Peers', field: 'peersCount' },
            { title: 'Public Key', field: 'publicKey' }
        ];
        const table = new Tabulator("#nodes-table", {
            data: tableData,
            columns,
            layout: "fitDataStretch",
        });

        $("#all-node-num").text(tableData.length);
        $("#dual-node-num").text(tableData.filter(x => x.roles === 3).length);
        $("#peer-node-num").text(tableData.filter(x => x.roles === 1).length);
        $("#api-node-num").text(tableData.filter(x => x.roles === 2).length);
    });
