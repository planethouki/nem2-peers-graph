/* global env, $ */
import 'bootstrap';
import './common.js';
import './style.scss';
const vis = require('vis-network');
const container = document.getElementById('mynetwork');

const makeGroups = (info) => {
    const result = {}
    for (let i = 0; i < info.color.length; i++) {
        function tryArray(array) {
            return Array.isArray(array) ? array[i] : array
        }
        result[i + 1] = {
            color: {
                border: tryArray(info.borderColor),
                background: info.color[i],
                highlight: {
                    border: info.highlightBorderColor
                        ? tryArray(info.highlightBorderColor)
                        : tryArray(info.borderColor),
                    background: info.highlightColor[i]
                        ? info.highlightColor[i]
                        : info.color[i]
                }
            },
            font: {
                color: tryArray(info.fontColor),
                size: 18
            },
            borderWidth: tryArray(info.borderWidth)
        }
    }

    return result;
};

const makeEdges = (info) => {
    return {
        color: {
            color: info.edgeColor,
            highlight: info.edgeHighlightColor
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
}

const a = {
    color: ['#0a62cc', '#239e49', '#afd643', '#e0e5cb', '#ddc47c', '#895a33', '#563813'],
    borderColor: '#c07a56',
    highlightColor: ['#0a62cc', '#239e49', '#afd643', '#e0e5cb', '#ddc47c', '#895a33', '#563813'],
    highlightBorderColor: '#c07a56',
    fontColor: '#f7f8f8',
    borderWidth: 2,
    edgeColor: '#C08552',
    edgeHighlightColor: '#5E3023'
}

const b = {
    color: ['#3681cc', '#4fb269', '#d5ea7d', '#ededed', '#dbcca9', '#9e785e', '#6b4d2f'],
    borderColor: '#f39800',
    highlightColor: ['#3681cc', '#4fb269', '#d5ea7d', '#ededed', '#dbcca9', '#9e785e', '#6b4d2f'],
    highlightBorderColor: '#f39800',
    fontColor: '#6a3906',
    borderWidth: 2,
    edgeColor: '#C08552',
    edgeHighlightColor: '#5E3023'
}

const c = {
    color: ["FFD429","fbc271","f9b673","f59d74","f2708c","dc5af0","9a5bf3","805cf5"]
        .map((c) => `#${c}`),
    borderColor: ["ffb029","f9a52f","f29436","eb7037","e5345a","bf1dd8","6c18e2","4614eb"]
        .map((c) => `#${c}`),
    highlightColor: ["ffc868","fbc170","f6b471","f19a72","ed768f","d75fe9","9a5eee","8260f1"]
        .map((c) => `#${c}`),
    highlightBorderColor: ["ffb029","f2a436","e59443","d8784b","ca4e69","aa3abb","7031c9","5027d8"]
        .map((c) => `#${c}`),
    fontColor: '#2f2d20',
    borderWidth: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    edgeColor: '#c2caef',
    edgeHighlightColor: '#10183c'
}

const groups = makeGroups(c);
const edges = makeEdges(c);

console.log(groups)

const options = {
    height: '100%',
    width: '100%',
    layout: {
        improvedLayout: true
    },
    nodes: {
        font: {
            size: 10,
        },
        shape: 'dot',
        size: 20
    },
    groups,
    edges
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
