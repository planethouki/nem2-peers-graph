require('dotenv').config();
const async = require('async');
const fs = require('fs');
const catapult = require('catapult-sdk');
const NodePeers = require('./NodePeers');
const NodeInfo = require('./NodeInfo');
const NodeConnection = require('./NodeConnection');

const certDir = process.env.CERT_DIR;

const config = {
    certificate: fs.readFileSync(`${certDir}/node.crt.pem`),
    key: fs.readFileSync(`${certDir}/node.key.pem`),
    caCertificate: fs.readFileSync(`${certDir}/ca.cert.pem`)
};

const startNode = {
    port: Number(process.env.PORT),
    host: process.env.HOST
};

const maxDepth = Number(process.env.MAX_DEPTH);

let peersInfo = {};

function recursion(node, depth, callback) {
    if (peersInfo[node.publicKey]) {
        return callback();
    }
    if (depth > maxDepth) {
        return callback();
    }
    const connection = new NodeConnection(node.host, node.port, config);
    connection
        .send(catapult.packet.PacketType.nodeDiscoveryPullPeers)
        .then((payload) => {
            return new NodePeers(payload).toJson();
        })
        .then((peers) => {
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
        .catch((e) => {
            console.error(e);
            callback();
        });
}

async.waterfall([
    (callback) => {
        const connection = new NodeConnection(startNode.host, startNode.port, config);
        connection
            .send(catapult.packet.PacketType.nodeDiscoveryPullPing)
            .then((payload) => {
                return new NodeInfo(payload).toJsonWithHost(startNode.host);
            })
            .then((nodeInfo) => {
                callback(null, nodeInfo);
            });
    },
    (node, callback) => {
        recursion(node, 0, callback);
    },
    (callback) => {
        fs.writeFile('../dist-peers/peers.json', JSON.stringify(peersInfo, null, '  '), callback);
    },
]);

