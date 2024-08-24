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
 
    // Handlers for drag events on nodes
    // Drag events adjust the [fx,fy] of the nodes to override the simulation
    function dragstarted(event,d) {
      d3.select(this).classed("fixed", true);
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event,d) {
      // get the x and y position of the svg
      const [xs, ys] = d3.pointer(event, d3.select(".network-graph").node());
      d.fx = projection.invert([xs, ys])[0];
      d.fy = projection.invert([xs, ys])[1];
    };

    function dragended(event,d) {
      if (!event.active) simulation.alphaTarget(0);
      // Keeping the [fx,fy] at the dragged positioned will pin it
      // Setting to null allows the simulation to change the [fx,fy]
      d.fx = null;
      d.fy = null;
    };

    let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);

    // Append weighted lines for each link in network
    const linkEnter = mapContainer 
      .selectAll('.link')
      .data(props.data.branch)
        .join('line')
          .attr('class', 'link')
          .attr('stroke-width', d => props.linkScale(d.phases.length));

    const nodeEnter = mapContainer 
    .selectAll('.node')
      .data(props.data.bus)
      .join('circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length))
        .attr('class', 'node')
        .call(drag); // Call drag object to setup all drag listeners for nodes

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
            .lower();

    function tickSimulation() {
      linkEnter
        .attr('x1', d => projection([d.source.x+lon, d.source.y+lat][0]))
        .attr('y1', d => projection([d.source.x+lon, d.source.y+lat][1]))
        .attr('x2', d => projection([d.target.x+lon, d.target.y+lat][0]))
        .attr('y2', d => projection([d.target.x+lon, d.target.y+lat][1]));

      nodeEnter
        .attr('cx', d => projection([d.x+lon, d.y+lat][0]))
        .attr('cy', d => projection([d.x+lon, d.y+lat][1]));

      pathEnter
          .attr('transform', function(d) { return `translate(${projection([d.x+lon, d.y+lat][0])}, ${projection([d.x+lon, d.y+lat][1])})`;});
    }

    // initialize simulation
    var simulation = d3.forceSimulation()
      .alpha(1).restart()
      .force("charge", d3.forceManyBody())
      .force('link', d3.forceLink().id(d => d.uid))
      .nodes(props.data.bus)
      .on('tick', tickSimulation);

    // Set up the links and what type of force will be used for the simulation
    // Again note that this has to be done in a separate block from above
    simulation
      .force('link')
      .links(props.data.branch);

    if (props.activeLayer === 'coordinates') {
      simulation.force("link", null);
      simulation.force("charge", null);
    }

  }, [props, lat, lon]);

  return ( 
    <g 
    ref={mapRef}
    />
  );    
}