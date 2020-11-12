/* eslint-disable */

const csv = require("csv-parser");
const fs = require("fs");
const { MercatorCoordinate } = require("mapbox-gl")
const { minBy, maxBy } = require('lodash')

const million = 1000 * 1000

const WORLD_BORDER = 30 * million

const points: any[] = [];

const convertToMercator = (x: number): number => (0.5 + (x / WORLD_BORDER * 0.5))

fs.createReadStream(`${__dirname}/../signs.csv`)
  .pipe(csv())
  .on("data", (data: any) => {
    const x = convertToMercator(parseInt(data.be_x))
    const y = convertToMercator(parseInt(data.be_z))
    console.log(`${data.be_x} => ${x} || ${data.be_z} => ${y}`)
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
