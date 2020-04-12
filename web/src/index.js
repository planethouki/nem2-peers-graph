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
            color: '#5E3023',
        },
        shape: 'box'
    },
    groups: {
        1: {
            color: {
                border: '#158CBA',
                background: '#158CBA',
                highlight: {
                    border: '#158CBA',
                    background: '#158CBA'
                }
            },
            font: {
                color: '#fff'
            }
        },
        2: {
            color: {
                border: '#fd7e14',
                background: '#fd7e14',
                highlight: {
                    border: '#fd7e14',
                    background: '#fd7e14',
                }
            },
            font: {
                color: '#fff'
            }
        },
        3: {
            color: {
                border: '#e83e8c',
                background: '#e83e8c',
                highlight: {
                    border: '#e83e8c',
                    background: '#e83e8c',
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
