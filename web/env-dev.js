const nodes = require('../discover/output/nodes.json');
const edges = require( '../discover/output/edges.json');
const peers = require( '../discover/output/peers.json');
const geos = require( '../discover/output/geos.json');

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
    }
}
