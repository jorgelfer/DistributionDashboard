import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { select } from "d3-selection";
import { geoEqualEarth, geoPath} from "d3-geo";
import { nyc_geo_data, color_breaks } from "./nyc_data";

export default function MapGeojson(props) {

  const mapRef = useRef();
  useEffect(() => {
    const mapContainer = d3.select(mapRef.current);

    const svg = mapContainer
        .append("svg")
        .attr("viewBox", `0 0 ${props.width} ${props.height}`);

    const projection = geoEqualEarth()
        .translate([props.width/2, props.height/2])
        .scale(220);

    const geoPathGenerator = geoPath()
        .projection(projection); 

    svg 
      .selectAll(".nyc-path")
      .data(nyc_geo_data().features)
      .join("path")
          .attr("class", "country-path")
          .attr("d", geoPathGenerator)
          .attr("fill", "#f8fcff")
          .attr("stroke", "#09131b")
          .attr("stroke-opacity", 0.4);
 
    // // Clean up on unmount
    // return () => map.current.remove();
  }, [nyc_geo_data(), props]);

  return ( 
    <div 
    ref={mapRef}
    />
  );    
}