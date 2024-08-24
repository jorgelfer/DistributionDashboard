import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { select } from "d3-selection";
import { geoMercator, geoPath} from "d3-geo";

export default function MapGeojson(props) {

  const mapRef = useRef();
  useEffect(() => {
    const mapContainer = d3.select(mapRef.current);

    const projection = geoMercator()
        .fitExtent([[0, 0], [props.width, props.height]], props.data);

    const geoPathGenerator = geoPath()
        .projection(projection); 

    mapContainer 
      .selectAll(".nyc-path")
      .data(props.data.features)
      .join("path")
          .attr("class", "country-path")
          .attr("d", geoPathGenerator)
          .attr("fill", "#f8fcff")
          .attr("stroke", "#09131b")
          .attr("stroke-opacity", 0.4);
 
    // // Clean up on unmount
    // return () => map.current.remove();
  }, [props]);

  return ( 
    <g 
    ref={mapRef}
    />
  );    
}