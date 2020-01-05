module.exports = {
    getGraphData() {
        return Promise.all([
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/nodes.json'),
            fetch('https://tools48gh23s.blob.core.windows.net/data/peers-graph/edges.json')
        ])
            .then(([nodes, edges]) => {
                return Promise.all([nodes.json(), edges.json()])
            })
    }
}
