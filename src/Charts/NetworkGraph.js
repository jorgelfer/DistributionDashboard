import { useState, useCallback, useEffect } from "react";
import * as d3 from "d3";

import Card from "../UI/Card/Card";
import ChartContainer from "../ChartComponents/ChartContainer";
import Buttons from "../Interactions/Buttons";

import NodeBreaker from "./Network/NodeBreaker";
import Net from "./Network/Net";
import ForceGraph from "./Network/ForceGraph";

import GeojsonMap from "./Mapping/GeojsonMap";
import bronx from "./Mapping/bronx.json";

import Form from "../UI/Device/Form";

const layers = [
  { id: "react", label: "React.js" },
  { id: "coordinates", label: "D3.js" },
  // { id: "coordinates", label: "Coordinates" },
  { id: "force", label: "Force" },
  { id: "nodebreaker", label: "Node Breaker" },
  { id: "geojson", label: "Geojson" },
];

export default function NetworkGraph({ margin, data, ...props }) {
  const width = 1000;
  const height = 542;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear().range([0, innerWidth]);

  const yScale = d3.scaleLinear().range([innerHeight, 0]);

  // scales
  const linkScale = d3
    .scaleSqrt()
    .domain(d3.extent(data.branch, (d) => d.f_connections.length))
    .range([2, 6]);

  // The force simulation mutates links and nodes,
  // so, make a deep copy of the dataset
  var network = JSON.parse(JSON.stringify(data));

  const handleSubmitDevice = useCallback(
    (device, remove) => {
      // initialize device container
      data[`${props.selectedValue}`] = data[`${props.selectedValue}`] || [];
      // filter out the devices in case it is already in the network
      data[`${props.selectedValue}`] = data[`${props.selectedValue}`].filter(
        (f) => f.uid !== device.uid
      );
      // append the device to the network
      if (!remove) {
        data[`${props.selectedValue}`].push(device);
      }
      // console.log(data[`${props.selectedValue}`]);
      network = JSON.parse(JSON.stringify(data));
    },
    [data, props.selectedValue]
  );

  const handleDeleteBuses = useCallback(
    (buses) => {
      console.log(buses);
      // delete the buses from the data
      data["bus"] = data["bus"].filter((f) => !buses.includes(f.uid));
      // data['bus'] = data['bus'].filter(f => console.log(f.uid));

      // delete associated branches
      data["branch"] = data["branch"].filter(
        (f) => !buses.includes(f.source) && !buses.includes(f.target)
      );

      // delete isolated buses
      data["bus"] = data["bus"].filter((f) => {
        return data["branch"].some(
          (d) => d.source === f.uid || d.target === f.uid
        );
      });

      // delete associated loads
      data["load"] = data["load"].filter((f) => !buses.includes(f.bus));

      // delete associated capacitors
      data["capacitor"] = data["capacitor"].filter(
        (f) => !buses.includes(f.bus)
      );

      // delete asocciated batteries
      if (data["battery"]) {
        data["battery"] = data["battery"].filter((f) => !buses.includes(f.bus));
      }

      // delete associated dr_load
      if (data["dr_load"]) {
        data["dr_load"] = data["dr_load"].filter((f) => !buses.includes(f.bus));
      }

      // delete associated flex_gen
      if (data["flex_gen"]) {
        data["flex_gen"] = data["flex_gen"].filter(
          (f) => !buses.includes(f.bus)
        );
      }

      // delete associated flex_load
      if (data["flex_load"]) {
        data["flex_load"] = data["flex_load"].filter(
          (f) => !buses.includes(f.bus)
        );
      }

      // update network data
      network = JSON.parse(JSON.stringify(data));
    },
    [data, props.selectedValue]
  );

  // active layer
  const [activeLayer, setActiveLayer] = useState("react");
  // handle layer selection
  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  }

  // selected device
  const [selectedDevice, setSelectedDevice] = useState(null);
  // handle device selection
  function handleSelectDevice(device) {
    setSelectedDevice(device);
  }

  // handle form change
  function handleChangeDevice(identifier, value) {
    setSelectedDevice((prevDevice) => ({
      ...prevDevice,
      [identifier]: value,
    }));
  }

  // handle network interactions
  const [selectedAction, setSelectedAction] = useState("cursor");
  function handleSelectedAction(selectedIcon) {
    if (selectedAction !== selectedIcon) {
      setSelectedAction(selectedIcon);
    }
  }

  // change action to default when a layer changes or
  // when a value is selected
  useEffect(() => {
    setSelectedAction("cursor");
  }, [activeLayer, props.selectedValue]);

  return (
    <Card>
      <h2>Network</h2>
      <Buttons
        buttons={layers}
        activeButton={activeLayer}
        onButtonSelection={layerSelectionHandler}
      />
      {selectedDevice && (
        <div className="device-form">
          {Form(
            props.selectedValue,
            selectedDevice,
            handleSelectDevice,
            handleChangeDevice,
            handleSubmitDevice
          )}
        </div>
      )}
      {activeLayer === "react" && (
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
        >
          <ForceGraph
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            margin={margin}
            data={network}
            activeLayer={activeLayer}
            originalNodeSize={props.nodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
            selectedAction={selectedAction}
            onSelectBus={props.onSelectBus}
            onSelectDevice={handleSelectDevice}
            onSubmitDevice={handleSubmitDevice}
            onDeleteBuses={handleDeleteBuses}
            onSelectedAction={handleSelectedAction}
          />
        </ChartContainer>
      )}
      {["coordinates", "force"].includes(activeLayer) && (
        <ChartContainer
          width={width}
          height={height}
          margin={margin}
          className="network-graph"
        >
          <Net
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            margin={margin}
            data={network}
            activeLayer={activeLayer}
            originalNodeSize={props.nodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
            onSelectBus={props.onSelectBus}
            selectedAction={selectedAction}
            onSelectDevice={handleSelectDevice}
            onSubmitDevice={handleSubmitDevice}
            onSelectedAction={handleSelectedAction}
          />
        </ChartContainer>
      )}
      {activeLayer === "nodebreaker" && (
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
            originalNodeSize={props.nodeSize}
            xScale={xScale}
            yScale={yScale}
            linkScale={linkScale}
            colorScale={props.colorScale}
            selectedValue={props.selectedValue}
          />
        </ChartContainer>
      )}
      {activeLayer === "geojson" && (
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
      )}
    </Card>
  );
}
