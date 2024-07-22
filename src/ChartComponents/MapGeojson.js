import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { select } from "d3-selection";
import { geoEqualEarth, geoPath} from "d3-geo";
import detroit from "./world.json";

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
        .selectAll(".detroit-path")
        .data(detroit.features)
        .join("path")
            .attr("class", "country-path")
            .attr("d", geoPathGenerator)
            .attr("fill", "#f8fcff")
            .attr("stroke", "#09131b")
            .attr("stroke-opacity", 0.4);
 
    // // Clean up on unmount
    // return () => map.current.remove();
  }, [detroit, props]);

  return ( 
    <div 
    ref={mapRef}
    />
  );    
}