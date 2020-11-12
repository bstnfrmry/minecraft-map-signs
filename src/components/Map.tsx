import { Point } from "@turf/turf";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";

import { Sign, SignProps } from "~/components/Sign";
import { config } from "~/config";

export const Map: React.FC = () => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapper.current) {
      return;
    }

    const map = new mapboxgl.Map({
      accessToken: config.mapbox.publicToken,
      container: wrapper.current,
      style: "mapbox://styles/bstnfrmry/ckherfro10y9219l981okv9tz",
      center: [0, 0],
      zoom: 0,
      renderWorldCopies: false,
    });

    map.once("load", () => {
      map.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        })
      );

      map.addSource("signs", {
        type: "geojson",
        data: "/data/points.json",
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "signs",
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "signs",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
          "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "signs",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.on("click", "clusters", (event) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["clusters"],
        });

        if (!features.length) {
          return;
        }

        const clusterId = features[0].properties?.cluster_id;
        if (!clusterId) {
          return;
        }

        const source = map.getSource("signs") as GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          const point = features[0].geometry as Point;

          map.easeTo({
            center: point.coordinates as [number, number],
            zoom: zoom,
          });
        });
      });

      map.on("click", "unclustered-point", (event) => {
        const [feature] = map.queryRenderedFeatures(event.point, {
          layers: ["unclustered-point"],
        });

        if (!feature) {
          return;
        }

        const props = feature.properties as SignProps;
        const text = ReactDOMServer.renderToString(<Sign {...props} />);

        new mapboxgl.Popup().setLngLat(event.lngLat).setHTML(text).addTo(map);
      });

      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  });

  return (
    <>
      <Head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <div ref={wrapper} className="w-full h-full" />
    </>
  );
};
