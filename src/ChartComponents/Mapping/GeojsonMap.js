import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoMercator, geoPath} from "d3-geo";
import Symbol from '../Network/Symbol';

export default function MapGeojson(props) {

  const lat = 40.8536;
  const lon = -73.8748;

  const mapRef = useRef();
  useEffect(() => {
    const mapContainer = d3.select(mapRef.current);

    // Append geojson map
    const projection = geoMercator()
      .translate([props.width/2, props.height/2])
      .fitExtent([[0, 0], [props.width, props.height]], props.geo_data);

    const geoPathGenerator = geoPath()
        .projection(projection); 

    mapContainer 
      .selectAll(".streets-path")
      .data(props.geo_data.features)
      .join("path")
          .attr("class", "streets-path")
          .attr("d", geoPathGenerator)
          .attr("fill", "#f8fcff")
          .attr("stroke", "#09131b")
          .attr("stroke-opacity", 0.4);
 
    const nodeEnter = mapContainer 
    .selectAll('.node')
      .data(props.data.bus)
      .join('circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length))
        .attr('class', 'node')
        .attr('cx', d => projection([props.xScale(d.x)+lon, props.yScale(d.y)+lat])[0])
        .attr('cy', d => projection([props.xScale(d.x)+lon, props.yScale(d.y)+lat])[1]);
        // .call(drag); // Call drag object to setup all drag listeners for nodes

    // Append icons for each node in the graph
    // console.log(props.selectedValue);
    const pathEnter = mapContainer 
    .selectAll('.symbol')
        .data(props.data.bus)
        .join("path")
            .attr("d", d3.symbol()
              .size(200)
              .type(Symbol(props.selectedValue)))
            .attr('class', 'symbol')
            .attr("stroke", "black")
            .attr("fill", "black")
            .style("visibility", "visible")
            .attr('transform', function(d) { 
              return `translate(${projection([props.xScale(d.x)+lon, props.yScale(d.y)+lat])[0]}, ${projection([props.xScale(d.x)+lon, props.yScale(d.y)+lat])[1]})`;
            });
            // .lower();

  }, [props, lat, lon]);

  return ( 
    <g 
    ref={mapRef}
    />
  );    
}