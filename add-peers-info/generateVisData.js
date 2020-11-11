require('dotenv').config();
const fs = require('fs');

new Promise((resolve) => {
    const peersJson = fs.readFileSync(process.env.PEERS_PATH, {encoding: 'utf-8'});
    const peersInfo = JSON.parse(peersJson);
    resolve(peersInfo)
})
    .then((peersInfo) => {
        const nodes = [];
        const edges = [];
        for (const peerPublicKey in peersInfo) {
            const peerInfo = peersInfo[peerPublicKey];
            if (nodes.findIndex(item => item.id === peerInfo.publicKey) < 0) {
                nodes.push({id: peerInfo.publicKey, label: peerInfo.host, group: peerInfo.roles})
            }
            const peers = peerInfo.peers;
            for (const p of peers) {
                if (nodes.findIndex(item => item.id === p.publicKey) < 0) {
                    nodes.push({id: p.publicKey, label: p.host, group: p.roles})
                }
                const edgesFind = edges.findIndex((item) => {
                    return (
                        item.from === peerInfo.publicKey && item.to === p.publicKey
                    ) || (
                        item.to === peerInfo.publicKey && item.from === p.publicKey
                    )
                });
                if (edgesFind < 0) {
                    edges.push({from: peerInfo.publicKey, to: p.publicKey})
                }
            }
        }
        fs.writeFileSync(`${process.env.OUT_DIR}/vis-nodes.json`, JSON.stringify(nodes, null, '  '));
        fs.writeFileSync(`${process.env.OUT_DIR}/vis-edges.json`, JSON.stringify(edges, null, '  '));
    });

