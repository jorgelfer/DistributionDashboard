import { useState } from 'react';
import * as d3 from 'd3';

import Circle from '../ChartComponents/Circle';
import Card from '../UI/Card/Card';
import ChartContainer from '../ChartComponents/ChartContainer';
import Layers from '../Interactions/Layers';
import Net from '../ChartComponents/Net';

const layers = [
  { id: "coordinates", label: "Coordinates" },
  { id: "map", label: "Map" },
  { id: "force", label: "Force" },
];

export default function NetworkGraph(props) {

  const [activeLayer, setActiveLayer] = useState("coordinates");

  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;
  const originalNodeSize = 4;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.x)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.y)])
    .range([innerHeight, 0]);

  // scales
  const linkScale = d3.scaleSqrt()
    .domain(d3.extent(props.data.branch, function (d) { return d.phases.length; }))
    .range([3, 7]);

  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  };

  return(
    <Card>
      <h2>Network</h2>
      <Layers
        layers={layers}
        activeLayer={activeLayer}
        onLayerSelection={layerSelectionHandler}
      />
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
      >
        <Net
          data={props.data}
          colorScale={props.colorScale}
          activeLayer={activeLayer}
          originalNodeSize={originalNodeSize}
          xScale={xScale}
          yScale={yScale}
          linkScale={linkScale}
        />
      </ChartContainer> 
    </Card>
  );
}