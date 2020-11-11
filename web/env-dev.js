const nodes = require('../dist-peers/vis-nodes.json');
const edges = require( '../dist-peers/vis-edges.json');
const peers = require( '../dist-peers/peers.json');
const geos = require( '../dist-peers/geos.json');
const rests = require( '../dist-peers/rests.json');

module.exports = {
    getGraphData() {
        return Promise.all([
            Promise.resolve(nodes),
            Promise.resolve(edges)
        ])
    },
    getPeersData() {
        return Promise.resolve(peers)
    },
    getGeoData() {
        return Promise.resolve(geos)
    },
    getRestData() {
        return Promise.resolve(rests)
    }
}
