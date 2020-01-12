const nodes = require('../discover/output/nodes.json');
const edges = require( '../discover/output/edges.json');
const peers = require( '../discover/output/peers.json');

module.exports = {
    getGraphData() {
        return Promise.all([
            Promise.resolve(nodes),
            Promise.resolve(edges)
        ])
    },
    getPeersData() {
        return Promise.resolve(peers)
    }
}
