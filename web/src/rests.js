/* global env */
import 'bootstrap';
import './common.js';
import './style.scss';
const Tabulator = require('tabulator-tables');

function dataToText(data, prop) {
    if (data === null || data === undefined) {
        return '-';
    }
    if (prop === 'url') {
        return data.host
    } else if (prop === 'db') {
        return data.status.db === 'up' ? '<span>&#x1f7e2;</span>' : '<span>&#x274C;</span>';
    } else if (prop === 'node') {
        return data.status.apiNode === 'up' ? '<span>&#x1f7e2;</span>' : '<span>&#x274C;</span>';
    }
    return ''
}

const rolesFormatPattern = {
    2: 'Api',
    3: 'Dual'
}

env.getRestData()
    .then((rests) => {
        const tableDataHttp = rests.map((rest) => {
            return {
                id: rest.host,
                roles: rest.roles,
                friendlyName: rest.friendlyName,
                url: dataToText(rest.http, 'url'),
                db: dataToText(rest.http, 'db'),
                node: dataToText(rest.http, 'node')            }
        });
        const tableDataHttps = rests.filter((rest) => {
            return rest.https !== null
        }).map((rest) => {
            return {
                id: rest.host,
                roles: rest.roles,
                friendlyName: rest.friendlyName,
                url: dataToText(rest.https, 'url'),
                db: dataToText(rest.https, 'db'),
                node: dataToText(rest.https, 'node')
            }
        });
        const columns = [
            { title: 'Name', field: 'friendlyName' },
            { title: 'Roles', field: 'roles', formatter: 'lookup', formatterParams: rolesFormatPattern },
            { title: 'Endpoint', field: 'url' },
            { title: 'DB', field: 'db', formatter: 'html' },
            { title: 'NODE', field: 'node', formatter: 'html' }
        ];
        const tableHttp = new Tabulator("#http-table", {
            data: tableDataHttp,
            columns,
            layout: "fitDataStretch",
        });
        const tableHttps = new Tabulator("#https-table", {
            data: tableDataHttps,
            columns,
            layout: "fitDataStretch",
        });
    });
