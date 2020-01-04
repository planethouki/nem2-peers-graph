const nodes = require('../discover/output/nodes.json');
const edges = require( '../discover/output/edges.json');

module.exports = {
    getGraphData() {
        return Promise.all([
            Promise.resolve(nodes),
            Promise.resolve(edges)
        ])
    }
}
