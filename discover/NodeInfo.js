const catapult = require('catapult-sdk');
const net = require('net');

module.exports = function(config, node, callback) {
    console.log(`connecting to ${node.host}:${node.port}`);
    const serverSocket = net.createConnection(node.port, node.host);
    const apiNodePublicKey = catapult.utils.convert.hexToUint8(node.publicKey);
    const clientKeyPair = catapult.crypto.createKeyPairFromPrivateKeyString(config.clientPrivateKey);

    let returnValue;
    let returnError;

    serverSocket
        .on('error', err => {
            console.error(`error raised by ${node.host}:${node.port} connection`, err);
        })
        .on('close', () => {
            console.log('connection close');
            callback(returnError, returnValue);
        });

    catapult.auth.createAuthPromise(serverSocket, clientKeyPair, apiNodePublicKey, console.log)
        .then(() => {
            const connection = serverSocket;
            const packetHeader = catapult.packet.header;
            const packetType = catapult.packet.PacketType.nodeDiscoveryPullPing;
            const packetBuffer = packetHeader.createBuffer(packetType, packetHeader.size);
            return new Promise((resolve, reject) => {
                connection.write(packetBuffer, resolve);
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                const connection = serverSocket;
                const packetParser = new catapult.parser.PacketParser();
                connection.once('close', () => {
                    serverSocket.destroy();
                    reject();
                });
                connection.on('data', data => {
                    packetParser.push(data);
                });
                packetParser.onPacket(packet => {
                    serverSocket.destroy();
                    resolve(packet);
                });
            })
        })
        .then((packet) => {
            const parser = new catapult.parser.BinaryParser();
            parser.push(packet.payload);
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
            nodeInfo.host = (0 === hostSize ? Buffer.alloc(0) : parser.buffer(hostSize)).toString();
            nodeInfo.friendlyName = (0 === friendlyNameSize ? Buffer.alloc(0) : parser.buffer(friendlyNameSize)).toString();
            if (nodeInfo.host === '') {
                nodeInfo.host = node.host
            }
            returnValue = nodeInfo;
        })
        .catch((e) => {
            returnError = e;
        });

};
