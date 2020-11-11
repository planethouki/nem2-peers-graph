require('dotenv').config();
const async = require('async');
const fs = require('fs');
const request = require('request');

const peers = JSON.parse(fs.readFileSync(process.env.PEERS_PATH, {encoding: 'utf-8'}));
const geos = [];

const regexIp = /^(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

function createBatchRequestData(peersObj) {
    const unit = 100;
    const requestDataArray = [];
    const peersIpArray = Object.keys(peersObj)
        .map((publicKey) => {
            return peersObj[publicKey].host
        })
        .filter((host) => {
            return regexIp.test(host)
        });
    for (let i = 0; i < Math.ceil(peersIpArray.length / unit); i++) {
        const requestData = peersIpArray
            .slice(i * unit, (i + 1) * unit);
        requestDataArray.push(requestData)
    }
    return requestDataArray;
}

function createSingleRequestData(peersObj) {
    return Object.keys(peersObj)
        .map((publicKey) => {
            return peersObj[publicKey].host
        })
        .filter((host) => {
            return !regexIp.test(host)
        });
}

async.waterfall([
    (done) => {
        async.eachSeries(
            createBatchRequestData(peers),
            (requestData, callback) => {
                request.post(
                    {url: 'http://ip-api.com/batch', body: requestData, json: true},
                    (error, response, body) => {
                        const successes = body.filter((geo) => {
                            if (geo && geo.status) {
                                return geo.status === 'success';
                            } else {
                                return false;
                            }
                        });
                        geos.push(...successes);
                        callback(error);
                    }
                )
            },
            done
        )
    },
    (done) => {
        async.eachSeries(
            createSingleRequestData(peers),
            (requestData, callback) => {
                request.post(
                    {url: `http://ip-api.com/json/${requestData}`, json: true},
                    (error, response, body) => {
                        if (body && body.status === 'success') {
                            geos.push(body)
                        }
                        callback(error);
                    }
                )
            },
            done
        )
    },
    (done) => {
        console.log(geos.length);
        fs.writeFile(
            `${process.env.OUT_DIR}/geos.json`,
            JSON.stringify(geos, null, '  '),
            done
        );
    }
]);

