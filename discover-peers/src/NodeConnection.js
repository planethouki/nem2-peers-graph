const catapult = require('catapult-sdk');
const tls = require('tls');

module.exports = class NodeConnection {

    constructor(host, port, config) {
        this.config = config;
        this.host = host;
        this.port = port;

        const contextOptions = {
            minVersion: 'TLSv1.3',
            key: config.key,
            cert: config.certificate,
            ca: [config.caCertificate],
            sigalgs: 'ed25519'
        };

        try {
            this.secureContext = tls.createSecureContext(contextOptions)
        } catch (error) {
            console.error('an error occurred with the provided TLS key and certificates before trying to establish any connection to the server');
            throw error;
        }

    }

    /**
     * connect to node
     * @param packetType catapult.packet.PacketType
     * @return {Promise<String>}
     */
    send(packetType) {
        console.log(`connecting to ${this.host}:${this.port}`);

        const connectionOptions = {
            host: this.host,
            port: this.port,
            secureContext: this.secureContext,
            rejectUnauthorized: false,
            // skip hostname checks since this is not a web-https case
            checkServerIdentity: () => undefined
        };

        const serverSocket = tls.connect(connectionOptions);

        return new Promise((resolve, reject) => {
            serverSocket
                .on('connect', () => {
                    if (serverSocket.authorized === false) {
                        console.log('insecure connect');
                        resolve();
                    }
                })
                .on('secureConnect', () => {
                    if (serverSocket.authorized) {
                        console.log('secure connect');
                        resolve();
                    }
                })
                .on('error', err => {
                    console.error(`error raised by ${this.host}:${this.port} connection`, err);
                    reject(err);
                })
                .once('close', () => {
                    console.log('close');
                    serverSocket.destroy();
                });
        })
            .then(() => {
                const packetHeader = catapult.packet.header;
                const packetBuffer = packetHeader.createBuffer(packetType, packetHeader.size);
                return new Promise((resolve) => {
                    serverSocket.write(packetBuffer, resolve);
                })
            })
            .then(() => {
                return new Promise((resolve) => {
                    const packetParser = new catapult.parser.PacketParser();
                    serverSocket.on('data', data => {
                        packetParser.push(data);
                    });
                    packetParser.onPacket(packet => {
                        serverSocket.end();
                        resolve(packet.payload);
                    });
                })
            });
    }
}
