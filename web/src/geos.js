/* global env, google */
import 'bootstrap';
import './common.js';
import './style.scss';

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
    });
