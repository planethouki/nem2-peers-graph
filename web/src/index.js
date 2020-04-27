/* global env, $ */
import 'bootstrap';
import './common.js';
import './style.scss';
const vis = require('vis-network');
const container = document.getElementById('mynetwork');

const options = {
    height: '100%',
    width: '100%',
    nodes: {
        font: {
            size: 10,
        },
        shape: 'box'
    },
    groups: {
        1: {
            color: {
                border: '#8a4121',
                background: '#8a4121',
                highlight: {
                    border: '#8a4121',
                    background: '#8a4121'
                }
            },
            font: {
                color: '#fff'
            }
        },
        2: {
            color: {
                border: '#728742',
                background: '#728742',
                highlight: {
                    border: '#728742',
                    background: '#728742',
                }
            },
            font: {
                color: '#fff'
            }
        },
        3: {
            color: {
                border: '#1c315d',
                background: '#1c315d',
                highlight: {
                    border: '#1c315d',
                    background: '#1c315d',
                }
            },
            font: {
                color: '#fff'
            }
        }
    },
    edges: {
        color: {
            color:'#adb5bd',
            highlight:'#999'
        },
        font: {
            size: 6,
            bold: {
                size: 20, // px
                face: 'arial',
                vadjust: 0,
                mod: 'bold'
            }
        },
        physics: false,
        smooth: {
            type: 'discrete'
        }
    }
};

env.getGraphData()
    .then(([nodes, edges]) => {
        $("#loading").remove();
        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };
        const network = new vis.Network(container, data, options);
    });
