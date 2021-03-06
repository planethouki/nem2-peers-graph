const catapult = require('catapult-sdk');

module.exports = class NodeInfo {
    constructor(payload) {
        this.payload = payload;
    }

    toJson() {
        const parser = new catapult.parser.BinaryParser();
        parser.push(this.payload);
        const nodeInfo = {};
        parser.uint32(); // Node size
        nodeInfo.version = parser.uint32();
        nodeInfo.publicKey = parser.buffer(catapult.constants.sizes.signerPublicKey).toString('hex').toUpperCase();
        nodeInfo.networkGenerationHash = parser.buffer(catapult.constants.sizes.hash256).toString('hex').toUpperCase();
        nodeInfo.roles = parser.uint32();
        nodeInfo.port = parser.uint16();
        nodeInfo.networkIdentifier = parser.uint8();
        const hostSize = parser.uint8();
        const friendlyNameSize = parser.uint8();
        nodeInfo.host = (Number(hostSize) > 0 ? parser.buffer(hostSize) : Buffer.alloc(0)).toString();
        nodeInfo.friendlyName = (Number(friendlyNameSize) > 0 ? parser.buffer(friendlyNameSize) : Buffer.alloc(0)).toString();
        return nodeInfo;
    }

    toJsonWithHost(host) {
        const nodeInfo = this.toJson();
        if (nodeInfo.host === '') {
            nodeInfo.host = host
        }
        return nodeInfo;
    }

}
