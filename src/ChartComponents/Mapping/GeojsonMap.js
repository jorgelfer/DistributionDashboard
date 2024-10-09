import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoMercator, geoPath} from "d3-geo";
import Symbol from '../Network/Symbol';
import { zoom } from "d3-zoom";
import { select } from "d3-selection";

export default function MapGeojson(props) {

  const lat = 40.8536;
  const lon = -73.8748;

  const nodeSize = 2;
  const symbolSize = 5;

  const geoShift = 0.03;

  // scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.x)])
    .range([0, geoShift]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.y)])
    .range([0, geoShift]);

  const linkScale = d3.scaleSqrt()
    .domain(d3.extent(props.data.branch, d => d.f_connections.length))
    .range([1, 2.5]);

  // main
  const mapRef = useRef();
  useEffect(() => {
    const mapContainer = d3.select(mapRef.current);

    // Append geojson map
    const projection = geoMercator()
      .translate([props.width/2, props.height/2])
      .fitExtent([[0, 0], [props.width, props.height]], props.geo_data);

    const geoPathGenerator = geoPath()
        .projection(projection); 

    // var path_group = mapContainer.append("g")
    //   .attr("id", "streets")
    path_group 
      .selectAll(".streets-path")
      .data(props.geo_data.features)
      .join("path")
          .attr("class", "streets-path")
          .attr("d", geoPathGenerator)
          .attr("fill", "#f8fcff")
          .attr("stroke", "#09131b")
          .attr("stroke-opacity", 0.4);
 
    // append links

    // var linkEnter = mapContainer.append("g")
    //   .attr("id", "links");
    
    linkEnter
    .selectAll(".link")
      .data(props.data.branch)
        .join("line")
        .attr("class", "link")
        .attr("x1", function(l) {
          var n = props.data.bus.filter(function(d) {
            return d.uid === l.source
          })[0];
          // console.log(n);
          d3.select(this).attr("y1", projection([xScale(n.x)+lon, yScale(n.y)+lat])[1]);
          return projection([xScale(n.x)+lon, yScale(n.y)+lat])[0]
        })
        .attr("x2", function(l) {
          var m = props.data.bus.filter(function(d) {
            return d.uid === l.target
          })[0];
          d3.select(this).attr("y2", projection([xScale(m.x)+lon, yScale(m.y)+lat])[1]);
          return projection([xScale(m.x)+lon, yScale(m.y)+lat])[0]
        })
        .attr("stroke-width", d => linkScale(d.f_connections.length));

    var nodeEnter = mapContainer.append("g")
      .attr("id", "nodes");

    nodeEnter
      .selectAll(".node")
      .data(props.data.bus)
      .join("g")
        .attr("class", "node")
        // .on("dblclick", node_dblclick)
        .attr('transform', function(d) { 
          return `translate(${projection([xScale(d.x)+0.001+lon, yScale(d.y)-0.001+lat])[0]}, ${projection([xScale(d.x)+0.001+lon, yScale(d.y)-0.001+lat])[1]})`;
        });
        // .call(drag); // Call drag object to setup all drag listeners for nodes

    // Append circles for each node in the graph
    nodeEnter
      .append('circle')
        .attr('class', 'circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length));

    nodeEnter
    .append("image")
      .attr("class", "symbol")
      .attr("xlink:href", Symbol(props.selectedValue))
      .attr("transform", "translate(5,5)")
      .attr("width", 25)
      .attr("height", 25)
      // .on('click', toolTip.show)
      // .style("display", "none");

    // // Append nodes for each node in the graph
    // mapContainer 
    // .selectAll('.geo-node')
    //   .data(props.data.bus)
    //   .join('circle')
    //     .attr("r", nodeSize)
    //     .style('fill', d => props.colorScale(d.phases.length))
    //     .attr('class', 'geo-node')
    //     .attr('cx', d => projection([xScale(d.x)+lon, yScale(d.y)+lat])[0])
    //     .attr('cy', d => projection([xScale(d.x)+lon, yScale(d.y)+lat])[1]);
    //     // .call(drag); // Call drag object to setup all drag listeners for nodes

    // // Append icons for each node in the graph
    // mapContainer 
    // .selectAll('.symbol')
    //     .data(props.data.bus)
    //     .join("path")
    //         .attr("d", d3.symbol()
    //           .size(symbolSize)
    //           .type(Symbol(props.selectedValue)))
    //         .attr('class', 'symbol')
    //         .attr("stroke", "black")
    //         .attr("fill", "black")
    //         .style("visibility", "visible")
    //         .attr('transform', function(d) { 
    //           return `translate(${projection([xScale(d.x)+0.001+lon, yScale(d.y)-0.001+lat])[0]}, ${projection([xScale(d.x)+0.001+lon, yScale(d.y)-0.001+lat])[1]})`;
    //         });
    //         // .lower();

    // Handle zoom
    const zoomHandler = zoom()
      .on("zoom", (e) => {
        mapContainer.attr("transform", e.transform);
      });
    
    select(".map-container")
      .call(zoomHandler);

  }, [props, lat, lon, nodeSize, symbolSize, xScale, yScale, linkScale]);

  return ( 
    <g 
    ref={mapRef}
    />
  );    
}