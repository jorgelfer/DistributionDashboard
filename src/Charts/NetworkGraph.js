import { useState } from 'react';
import * as d3 from 'd3';

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

  // initialize scales
  const x_net = d3.scaleLinear()
    .range([0, innerWidth]);

  const y_net = d3.scaleLinear()
    .range([innerHeight, 0]);

  const layerSelectionHandler = (id) => {
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
          x_net={x_net}
          y_net={y_net}
        />
      </ChartContainer> 
    </Card>
  );
}