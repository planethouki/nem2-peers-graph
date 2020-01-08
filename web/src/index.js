/* global env */
import 'bootstrap';
import './index.scss';

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
                border: '#5E3023',
                background: '#F3E9DC',
                highlight: {
                    border: '#5E3023',
                    background: '#F3E9DC',
                }
            },
        },
        2: {
            color: {
                border: '#F3E9DC',
                background: '#5E3023',
                highlight: {
                    border: '#F3E9DC',
                    background: '#5E3023',
                }
            },
            font: {
                color: '#F3E9DC'
            }
        },
        3: {
            color: {
                border: '#5E3023',
                background: '#f3cd88',
                highlight: {
                    border: '#5E3023',
                    background: '#f3cd88',
                }
            },
        }
    },
    edges: {
        color: {
            color:'#C08552',
            highlight:'#5E3023'
        },
        font: {
            size: 6,
            bold: {
                color: '#343434',
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
        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };
        const network = new vis.Network(container, data, options);
    });

