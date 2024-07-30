import { useState } from 'react';
import * as d3 from 'd3';

import Card from '../UI/Card/Card';
import ChartContainer from '../ChartComponents/ChartContainer';
import Layers from '../Interactions/Layers';
import Net from '../ChartComponents/Network/Net';
import MapLeaflet from '../ChartComponents/Mapping/MapLeaflet';
import MapMapbox from '../ChartComponents/Mapping/MapMapbox';
import MapGeojson from '../ChartComponents/Mapping/MapGeojson';
import Symbol from '../ChartComponents/Network/Symbol';


const layers = [
  { id: "coordinates", label: "Coordinates" },
  { id: "force", label: "Force" },
  { id: "leaflet", label: "Leaflet" },
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
      <Layers
        layers={layers}
        activeLayer={activeLayer}
        onLayerSelection={layerSelectionHandler}
      />
      {activeLayer === "leaflet" && <MapLeaflet
          data={network}
          colorScale={props.colorScale}
          activeLayer={activeLayer}
          originalNodeSize={originalNodeSize}
          xScale={xScale}
          yScale={yScale}
          linkScale={linkScale}
      />}
      {activeLayer === "mapbox" && <MapMapbox/>}
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
        <MapGeojson
          width={width}
          height={height}
        />
      }
    </Card>
  );
}