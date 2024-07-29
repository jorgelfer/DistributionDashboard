import React, { useEffect, useRef } from "react";
import { LayerGroup, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as d3 from "d3";
import { geoTransform, geoPath} from "d3-geo";

export default function MapLeaflet(props) {
  // const mapRef = useRef(null);
  // const mapRef = useMap();
  const latitude = -41.2858;
  const longitude = 174.7868;

  function D3Layer(props) {
    const map = useMap();

    useEffect(() => {
      const svg = d3.select(map.getPanes().overlayPane).append("svg");
      const g = svg.append("g").attr("class", "leaflet-zoom-hide");

      // Append weighted lines for each link in network
      // const linkEnter = g 
      //   .selectAll('.link')
      //   .data(props.data.branch)
      //     .join('line')
      //       .attr('class', 'link')
      //       .attr('stroke-width', d => props.linkScale(d.phases.length));

      // Append circles for each node in the graph
      const nodeEnter = g 
      .selectAll('.node')
        .data(props.data.bus)
        .join('circle')
          .attr("r", props.originalNodeSize)
          .style('fill', d => props.colorScale(d.phases.length))
          .attr('cx', d => longitude)
          .attr('cy', d => latitude)
          .attr('class', 'node');

      // function tickSimulation() {
      //   linkEnter
      //     .attr('x1', d => d.source.x + longitude)
      //     .attr('y1', d => d.source.y + latitude)
      //     .attr('x2', d => d.target.x + longitude)
      //     .attr('y2', d => d.target.y + latitude);

      //   nodeEnter
      //     .attr('cx', d => d.x + longitude)
      //     .attr('cy', d => d.y + latitude);
      // }
      
      // // initialize simulation
      // var simulation = d3.forceSimulation()
      //   .alpha(1).restart()
      //   .force("charge", d3.forceManyBody())
      //   .force('link', d3.forceLink().id(d => d.uid))
      //   .nodes(props.data.bus)
      //   .on('tick', tickSimulation);

      // // Set up the links and what type of force will be used for the simulation
      // // Again note that this has to be done in a separate block from above
      // simulation
      //   .force('link')
      //   .links(props.data.branch);

      // simulation.force("link", null);
      // simulation.force("charge", null);

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    }, [props]);
    return null;
  }

  return ( 
    <>
      {/* Make sure you set the height and width of the map container otherwise the map won't show */}
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={13} 
        zoomAnimation={false}
        // ref={mapRef} 
        style={{height: "30vh", width: "40vw"}}>
        <LayerGroup>
          <D3Layer 
            data={props.data}
            colorScale={props.colorScale}
            activeLayer={props.activeLayer}
            originalNodeSize={props.originalNodeSize}
            xScale={props.xScale}
            yScale={props.yScale}
            linkScale={props.linkScale}
          />
        </LayerGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Additional map layers or components can be added here */}
      </MapContainer>
    </>
  );    
}