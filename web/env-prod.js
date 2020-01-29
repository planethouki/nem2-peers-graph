module.exports = {
    getGraphData() {
        return Promise.all([
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/nodes.json?_=' + Date.now()),
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/edges.json?_=' + Date.now())
        ])
            .then(([nodes, edges]) => {
                return Promise.all([nodes.json(), edges.json()])
            })
    },
    getPeersData() {
        return fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/peers.json?=_' + Date.now())
            .then((peers) => peers.json())
    }
}
