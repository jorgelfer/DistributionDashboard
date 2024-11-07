import { useState, useCallback } from 'react';
import * as d3 from 'd3';

import Card from '../UI/Card/Card';
import ChartContainer from '../ChartComponents/ChartContainer';
import Buttons from '../Interactions/Buttons';

import NodeBreaker from './Network/NodeBreaker';
import Net from './Network/Net';
import ForceGraph from './Network/ForceGraph';

import GeojsonMap from './Mapping/GeojsonMap';
import bronx from "./Mapping/bronx.json";

import Form from '../UI/Device/Form';
import { renderToString } from 'react-dom/server';

const layers = [
  { id: "react", label: "React" },
  { id: "coordinates", label: "Coordinates" },
  { id: "force", label: "Force" },
  { id: "nodebreaker", label: "Node Breaker" },
  { id: "geojson", label: "Geojson" },
];

export default function NetworkGraph({margin, data, ...props}) {

  const [activeLayer, setActiveLayer] = useState("react");
  const width = 700;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const originalNodeSize = 6;

  const xScale = d3.scaleLinear()
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

  // scales
  const linkScale = d3.scaleSqrt()
    .domain(d3.extent(data.branch, d => d.f_connections.length))
    .range([2, 6]);

  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  };

  const updateData = useCallback((network) => {
    data[`${props.selectedValue}`] = network[`${props.selectedValue}`]; 
    // console.log(data)
  }, [data, props.selectedValue]);

  // The force simulation mutates links and nodes,
  // so, make a deep copy of the dataset 
  const network = JSON.parse(JSON.stringify(data));

  const deviceTooltip = useCallback((bus) => {
    // Find the device in the network
    let device = network[`${props.selectedValue}`].find(f => f.bus === bus.uid)
    return renderToString(Form(props.selectedValue, device));
  }, [network, props.selectedValue]);

  // selected device
  const [selectedDevice, setSelectedDevice] = useState(false);
  function handleSelectDevice(device) {
    setSelectedDevice(device);
  };
  
  return(
    <Card>
      <h2>Network</h2>
      <Buttons
        buttons={layers}
        activeButton={activeLayer}
        onButtonSelection={layerSelectionHandler}
      />
      {selectedDevice && 
      <div className="game-over">
        {Form(props.selectedValue, selectedDevice)}
      </div>
      }
      {(activeLayer === "react") &&
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
          >
          <ForceGraph
            updateData={updateData}
            deviceTooltip={deviceTooltip}
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            margin={margin}
            data={network}
            activeLayer={activeLayer}
            originalNodeSize={originalNodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
            onSelectBus={props.onSelectBus}
            onSelectDevice={handleSelectDevice}
          />
        </ChartContainer>
        }
      {["coordinates", "force"].includes(activeLayer) &&
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
          >
          <Net
            updateData={updateData}
            deviceTooltip={deviceTooltip}
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            margin={margin}
            data={network}
            activeLayer={activeLayer}
            originalNodeSize={originalNodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
            onSelectBus={props.onSelectBus}
          />
        </ChartContainer>
        }
      {activeLayer === "nodebreaker" && 
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
          >
          <NodeBreaker
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
        </ChartContainer>
      }
      {activeLayer === "geojson" &&
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="map-container"
          >
          <GeojsonMap
            width={innerWidth}
            height={innerHeight}
            geo_data={bronx}
            data={network}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
          />
        </ChartContainer>
      }
    </Card>
  );
}