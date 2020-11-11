require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');

const timeout = 2000;

function log(...args) {
    console.log(...args);
}

const main = async (peers) => {
    const apiPeers = Object.keys(peers).map((publicKey) => {
        const peer = peers[publicKey];
        return {
            roles: peer.roles,
            host: peer.host,
            friendlyName: peer.friendlyName,
        }
    }).filter((peer) => {
        return peer.roles !== 1
    });

    const createRequestFunc = (httpLibrary) => (url) => {
        return new Promise((resolve, reject) => {
            let isDataObtained = false;
            const options = {
                host: url.hostname,
                path: url.pathname,
                port: url.port
            };
            const req = httpLibrary.request(options, (res) => {
                res.on('data', (chunk) => {
                    log(url.hostname, 'data');
                    isDataObtained = true;
                    const body = JSON.parse(chunk.toString());
                    resolve({
                        ...body,
                        host: `${url.protocol}//${url.host}`
                    });
                });
            });
            req.end();
            req.on('error', (e) => {
                log(url.hostname, 'error');
                log(e.code);
                if (e.code === 'ERR_TLS_CERT_ALTNAME_INVALID') {
                    const host2 = e.cert.subject.CN;
                    const req2 = httpLibrary.request({
                        ...options,
                        host: host2
                    }, (res2) => {
                        res2.on('data', (chunk2) => {
                            log(host2, 'data');
                            const body2 = JSON.parse(chunk2.toString());
                            resolve({
                                ...body2,
                                host: `${url.protocol}//${host2}:${url.port}`
                            });
                        });
                    });
                    req2.end();
                } else {
                    reject(e);
                }
            });
            setTimeout(() => {
                if (isDataObtained === false) {
                    req.abort();
                }
            }, timeout);
        }).catch((e) => {
            return null
        });
    }

    const tryHttp = createRequestFunc(http);
    const tryHttps = createRequestFunc(https);

    const output = [];
    for (const peer of apiPeers) {
        log('------------------------------', peer.friendlyName);
        const result = await Promise.all([
            tryHttp(new URL(`http://${peer.host}:3000/node/health`)),
            tryHttps(new URL(`https://${peer.host}:3001/node/health`))
        ]).then(([http, https]) => {
            return {
                ...peer,
                http,
                https
            }
        });
        output.push(result);
    }
    return output;
}

const peers = JSON.parse(fs.readFileSync(process.env.PEERS_PATH, {encoding: 'utf-8'}));

main(peers).then((rests) => {
   fs.writeFileSync(
       `${process.env.OUT_DIR}/rests.json`,
       JSON.stringify(rests, null, '  ')
   );
});
