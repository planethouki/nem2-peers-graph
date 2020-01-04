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


let peersInfo = {};

function recursion(node, depth, callback) {
    if (peersInfo[node.publicKey]) {
        return callback();
    }
    if (depth > 3) {
        return callback();
    }
    nodePeers(config, node, (err, peers) => {
        if (!(peers && peers.length > 0)) {
            return callback();
        }
        peersInfo[node.publicKey] = {
            ...node,
            peers
        };
        console.log('--------------', node.host, peers.length, depth, '-------------');
        const newDepth = depth + 1;
        async.eachSeries(peers, (peer, cb) => {
            recursion(peer, newDepth, cb)
        }, callback)
    })
}

recursion(startNode, 0, () => {
    fs.writeFileSync('./output/peers.json', JSON.stringify(peersInfo, null, '  '));
    console.log("-------------------- finish");
});
