module.exports = {
    getGraphData() {
        return Promise.all([
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/vis-nodes.json?_=' + Date.now()),
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/vis-edges.json?_=' + Date.now())
        ])
            .then(([nodes, edges]) => {
                return Promise.all([nodes.json(), edges.json()])
            })
    },
    getPeersData() {
        return fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/peers.json?=_' + Date.now())
            .then((peers) => peers.json())
    },
    getGeoData() {
        return fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/geos.json?=_' + Date.now())
            .then((geos) => geos.json())
    },
    getRestData() {
        return fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/rests.json?=_' + Date.now())
            .then((geos) => geos.json())
    }
}
