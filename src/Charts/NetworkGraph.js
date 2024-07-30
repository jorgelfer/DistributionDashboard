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

export default function NetworkGraph(props) {

  const [activeLayer, setActiveLayer] = useState("coordinates");

  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;
  const originalNodeSize = 6;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.x)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(props.data.bus, d => d.y)])
    .range([innerHeight, 0]);

  // scales
  const linkScale = d3.scaleSqrt()
    .domain(d3.extent(props.data.branch, function (d) { return d.phases.length; }))
    .range([2, 6]);

  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  };

  // The force simulation mutates links and nodes,
  // so, make a deep copy of the dataset 
  const network = JSON.parse(JSON.stringify(props.data));

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
          margin={props.margin}
          className="network-graph"
          >
          <Net
            data={network}
            colorScale={props.colorScale}
            activeLayer={activeLayer}
            originalNodeSize={originalNodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            selectedValue={props.selectedValue}
            margin={props.margin}
          />
          <svg xmlns="http://www.w3.org/2000/svg">
              <symbol id="0" name="demand" viewBox="0 0 576 512">
                  <path d="M96 0C78.3 0 64 14.3 64 32v96h64V32c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32v96h64V32c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32v32c0 77.4 55 142 128 156.8V480c0 17.7 14.3 32 32 32s32-14.3 32-32V412.8c12.3-2.5 24.1-6.4 35.1-11.5c-2.1-10.8-3.1-21.9-3.1-33.3c0-80.3 53.8-148 127.3-169.2c.5-2.2 .7-4.5 .7-6.8c0-17.7-14.3-32-32-32H32zM432 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm47.9-225c4.3 3.7 5.4 9.9 2.6 14.9L452.4 356H488c5.2 0 9.8 3.3 11.4 8.2s-.1 10.3-4.2 13.4l-96 72c-4.5 3.4-10.8 3.2-15.1-.6s-5.4-9.9-2.6-14.9L411.6 380H376c-5.2 0-9.8-3.3-11.4-8.2s.1-10.3 4.2-13.4l96-72c4.5-3.4 10.8-3.2 15.1 .6z"></path>
              </symbol>
              <symbol id="1" name="pv" viewBox="0 0 640 512">
                  <path d="M122.2 0C91.7 0 65.5 21.5 59.5 51.4L8.3 307.4C.4 347 30.6 384 71 384H288v64H224c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V384H569c40.4 0 70.7-36.9 62.8-76.6l-51.2-256C574.5 21.5 548.3 0 517.8 0H122.2zM260.9 64H379.1l10.4 104h-139L260.9 64zM202.3 168H101.4L122.2 64h90.4L202.3 168zM91.8 216H197.5L187.1 320H71L91.8 216zm153.9 0H394.3l10.4 104-169.4 0 10.4-104zm196.8 0H548.2L569 320h-116L442.5 216zm96-48H437.7L427.3 64h90.4l31.4-6.3L517.8 64l20.8 104z"></path>
              </symbol>
              <symbol id="2" name="battery" viewBox="0 0 512 512">
                  <path d="M80 96c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32l96 0c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32h16c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64l16 0zm304 96c0-8.8-7.2-16-16-16s-16 7.2-16 16v32H320c-8.8 0-16 7.2-16 16s7.2 16 16 16h32v32c0 8.8 7.2 16 16 16s16-7.2 16-16V256h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H384V192zM80 240c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16z"></path>
              </symbol>
              <symbol id="3" name="dr" viewBox="0 0 576 512">
                  <path d="M96 0C78.3 0 64 14.3 64 32v96h64V32c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32v96h64V32c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32v32c0 77.4 55 142 128 156.8V480c0 17.7 14.3 32 32 32s32-14.3 32-32V412.8c12.3-2.5 24.1-6.4 35.1-11.5c-2.1-10.8-3.1-21.9-3.1-33.3c0-80.3 53.8-148 127.3-169.2c.5-2.2 .7-4.5 .7-6.8c0-17.7-14.3-32-32-32H32zM432 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm59.3-180.7L454.6 368l36.7 36.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L432 390.6l-36.7 36.7c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L409.4 368l-36.7-36.7c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L432 345.4l36.7-36.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </symbol>
              <symbol id="4" name="source" viewBox="0 0 576 512">
                  <path d="M64 32C46.3 32 32 46.3 32 64V304v48 80c0 26.5 21.5 48 48 48H496c26.5 0 48-21.5 48-48V304 152.2c0-18.2-19.4-29.7-35.4-21.1L352 215.4V152.2c0-18.2-19.4-29.7-35.4-21.1L160 215.4V64c0-17.7-14.3-32-32-32H64z"></path>
              </symbol>
          </svg>
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