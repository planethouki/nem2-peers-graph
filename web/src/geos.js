/* global env, google */
import 'bootstrap';
import './common.js';
import './style.scss';
const Tabulator = require('tabulator-tables');

function color(value, max) {
    const hue = Math.floor((value / max) * 120) + 120;
    console.log(hue);
    return `hsl(${hue},50%,70%)`;
}

env.getGeoData()
    .then((data) => {
        let maxCount = 0;
        const countryCodeToData = {};
        data.forEach((geo) => {
            if (countryCodeToData[geo.countryCode] === undefined) {
                countryCodeToData[geo.countryCode] = {
                    count: 1,
                    country: geo.country
                };
                if (maxCount < 1) maxCount = 1;
            } else {
                countryCodeToData[geo.countryCode].count += 1;
                if (maxCount < countryCodeToData[geo.countryCode].count) {
                    maxCount = countryCodeToData[geo.countryCode].count
                }
            }
        });

        const map = AmCharts.makeChart("mapdiv",{
            type: "map",
            theme: "dark",
            projection: "mercator",
            panEventsEnabled : true,
            backgroundColor : "#535364",
            backgroundAlpha : 1,
            zoomControl: {
                zoomControlEnabled : true
            },
            dataProvider : {
                map : "worldHigh",
                getAreasFromMap : true,
                areas : Object.keys(countryCodeToData).map((countryCode) => {
                    const geo = countryCodeToData[countryCode]
                    return {
                        id: countryCode,
                        value: geo.count,
                        title: `${geo.country}: ${geo.count}`,
                        color: color(geo.count, maxCount)
                    }
                })
            },
            areasSettings : {
                autoZoom : true,
                color : "#B4B4B7",
                colorSolid : "#84ADE9",
                selectedColor : "#84ADE9",
                outlineColor : "#666666",
                rollOverColor : "#9EC2F7",
                rollOverOutlineColor : "#000000"
            }
        });

        const tableData = Object.keys(countryCodeToData)
            .map((countryCode) => {
                const geo = countryCodeToData[countryCode]
                return {
                    id: countryCode,
                    ...geo
                }
            })
            .sort((a, b) => {
                return b.count - a.count
            });
        const columns = [
            { title: 'Country', field: 'country', minWidth: 100 },
            { title: 'Count', field: 'count', minWidth: 70 },
            {
                title:"Count",
                field:"count",
                formatter:"progress",
                formatterParams:{
                    min: 0,
                    max: maxCount,
                    color: [color(0, maxCount), color(maxCount / 2, maxCount) ,color(maxCount, maxCount)],
                    legendColor: "#000000",
                    legendAlign: "center",
                },
                widthGrow: 5
            }
        ];
        const table = new Tabulator("#geos-table", {
            layout: "fitColumns",
            data: tableData,
            columns,
        });
    });
