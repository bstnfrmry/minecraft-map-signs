/* eslint-disable */

const csv = require("csv-parser");
const fs = require("fs");
const { MercatorCoordinate } = require("mapbox-gl")
const { minBy, maxBy } = require('lodash')

const MAP_SIZE = 60000000

const points: any[] = [];

fs.createReadStream(`${__dirname}/../signs.csv`)
  .pipe(csv())
  .on("data", (data: any) => {
    const x = parseInt(data.be_x) / MAP_SIZE
    const y = parseInt(data.be_z) / MAP_SIZE

    points.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: new MercatorCoordinate(x, y).toLngLat().toArray(),
      },
      properties: {
        x: parseInt(data.be_x),
        z: parseInt(data.be_z),
        text1: data.text1,
        text2: data.text2,
        text3: data.text3,
        text4: data.text4,
      },
    })
  })
  .on('end', () => {
    fs.writeFileSync(`${__dirname}/../public/data/points.json`, JSON.stringify({
      type: 'FeatureCollection',
      features: points,
    }))
  })
