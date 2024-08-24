import { useState } from 'react';
import * as d3 from 'd3';

import Card from '../UI/Card/Card';
import ChartContainer from '../ChartComponents/ChartContainer';
import Buttons from '../Interactions/Buttons';
import Net from '../ChartComponents/Network/Net';
import MapboxGLMap from '../ChartComponents/Mapping/MapboxGLMap';
import GeojsonMap from '../ChartComponents/Mapping/GeojsonMap';
import bronx from "../ChartComponents/Mapping/bronx.json";


const layers = [
  { id: "coordinates", label: "Coordinates" },
  { id: "force", label: "Force" },
  { id: "mapbox", label: "Mapbox" },
  { id: "geojson", label: "Geojson" },
];

export default function NetworkGraph({margin, data, ...props}) {

  const [activeLayer, setActiveLayer] = useState("coordinates");

  const width = 700;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const originalNodeSize = 6;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.bus, d => d.x)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.bus, d => d.y)])
    .range([innerHeight, 0]);

  // scales
  const linkScale = d3.scaleSqrt()
    .domain(d3.extent(data.branch, function (d) { return d.phases.length; }))
    .range([2, 6]);

  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  };

  // The force simulation mutates links and nodes,
  // so, make a deep copy of the dataset 
  const network = JSON.parse(JSON.stringify(data));

  return(
    <Card>
      <h2>Network</h2>
      <Buttons
        buttons={layers}
        activeButton={activeLayer}
        onButtonSelection={layerSelectionHandler}
      />
      {activeLayer === "mapbox" && 
      <MapboxGLMap
        data={bronx}
      />}
      {["coordinates", "force"].includes(activeLayer) &&
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
          >
          <Net
            margin={margin}
            data={network}
            activeLayer={activeLayer}
            originalNodeSize={originalNodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
          />
        </ChartContainer>}
      {activeLayer === "geojson" &&
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
          >
          <GeojsonMap
            width={innerWidth}
            height={innerHeight}
            geo_data={bronx}
          />
        </ChartContainer>
      }
    </Card>
  );
}