module.exports = {
    getGraphData() {
        return Promise.all([
            fetch('https://tools48gh23s.z31.web.core.windows.net/peers-graph/data/nodes.json'),
            fetch('https://tools48gh23s.z31.web.core.windows.net/peers-graph/data/edges.json')
        ])
            .then(([nodes, edges]) => {
                return Promise.all([nodes.json(), edges.json()])
            })
    }
}
