process.env.HASHING_FUNCTION = 'keccak';
const nodePeers = require('./NodePeers');
const nodeInfo = require('./NodeInfo');
const async = require('async');
const fs = require('fs');

const config = {
    clientPrivateKey: 'E8532B288B1FBBCD846A99A64D2F42748A5F26C7891BB0FA2D711DAACBAB3718'
};
const startNode = {
    "publicKey": "F2EBF3EF755B98FC0756630BFBA85B353FA19E13C26D27EEC4AB8B7796385BBF",
    "port": 7900,
    "host": "beacon-02.us-west-1.symboldev.network"
};
const maxDepth = 1;


let peersInfo = {};

function recursion(node, depth, callback) {
    if (peersInfo[node.publicKey]) {
        return callback();
    }
    if (depth > maxDepth) {
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

async.waterfall([
    async.apply(nodeInfo, config, startNode),
    (node, callback) => {
        recursion(node, 0, callback);
    },
    (callback) => {
        fs.writeFile('./output/peers.json', JSON.stringify(peersInfo, null, '  '), callback);
    },
]);

