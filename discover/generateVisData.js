process.env.HASHING_FUNCTION = 'keccak';
const nodePeers = require('./NodePeers');
const nodeInfo = require('./NodeInfo');
const async = require('async');
const fs = require('fs');

const config = {
    clientPrivateKey: 'E8532B288B1FBBCD846A99A64D2F42748A5F26C7891BB0FA2D711DAACBAB3718'
};
const startNode = {
    "version": 0,
    "publicKey": "945FE33CEBE8EA7B3F7530A57649E4575F5DCE8741B94949BB105E2A1996A349",
    "roles": 3,
    "port": 7900,
    "networkIdentifier": 152,
    "host": "test-api.48gh23s.xyz",
    "friendlyName": "test-api.48gh23s.xyz"
};

new Promise((resolve) => {
    const peersJson = fs.readFileSync('./output/peers.json', {encoding: 'utf-8'});
    const peersInfo = JSON.parse(peersJson);
    resolve(peersInfo)
})
    .then((peersInfo) => {
        const nodes = [];
        const edges = [];
        for (const peerPublicKey in peersInfo) {
            const peerInfo = peersInfo[peerPublicKey];
            if (nodes.findIndex(item => item.id === peerInfo.publicKey) < 0) {
                nodes.push({id: peerInfo.publicKey, label: peerInfo.host, group: peerInfo.roles})
            }
            const peers = peerInfo.peers;
            for (const p of peers) {
                if (nodes.findIndex(item => item.id === p.publicKey) < 0) {
                    nodes.push({id: p.publicKey, label: p.host, group: p.roles})
                }
                const edgesFind = edges.findIndex((item) => {
                    return (
                        item.from === peerInfo.publicKey && item.to === p.publicKey
                    ) || (
                        item.to === peerInfo.publicKey && item.from === p.publicKey
                    )
                });
                if (edgesFind < 0) {
                    edges.push({from: peerInfo.publicKey, to: p.publicKey})
                }
            }
        }
        fs.writeFileSync('./output/nodes.json', JSON.stringify(nodes, null, '  '));
        fs.writeFileSync('./output/edges.json', JSON.stringify(edges, null, '  '));
    });

