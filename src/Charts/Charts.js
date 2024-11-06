import React from "react";
import { useState } from "react";
import * as d3 from 'd3';
import Header from "../UI/Header/Header";
import LineChartVM from './LineChartVM';
import LineChartPQS from './LineChartPQS';
import NetworkGraph from './NetworkGraph';
import { updateData } from "../Data/update";

export default function Charts(props) {

  const margin = {top: 30, right: 30, bottom: 50, left: 70};
  var colorScale = d3.scaleQuantile()
      .domain([0,1,2,3,4])
      .range(["red","#f28e2c", "#59a14f", "#4e79a7","red"]);

  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");

  // Header
  const [selectedValue, setSelectedValue] = useState('vm');
  function handleClick(selectedButton) {
    if (selectedValue !== selectedButton) {
      setSelectedValue(selectedButton);
    }
  }

  // selected buses
  const [selectedBus, setSelectedBus] = useState(null);
  function handleSelectBus(bus) {
    setSelectedBus(bus);
  };

  // console.log(props.data);
  const [data, y_extent] = updateData(props.data, selectedValue, selectedBus, dateParser);
  return (
    <>
      <Header handleClick={handleClick} selectedValue={selectedValue} />
      <h1>Distribution Dashboard</h1>
      <div className='wrapper'>
        <div className='one'>
          <NetworkGraph 
            margin={margin} 
            data={props.data} 
            colorScale={colorScale}
            selectedValue={selectedValue}
            onSelectBus={handleSelectBus}
          />
          {selectedBus && 
          <p className="form-actions">
            <button className="login-button" onClick={() => handleSelectBus(null)}>Release</button>
          </p>}
        </div>
        <div className='two'>
          {["vm", "battery"].includes(selectedValue) &&
          <LineChartVM 
            margin={margin} 
            data={data} 
            y_extent={y_extent} 
            colorScale={colorScale}
            time={props.data["time"]}
            dateParser={dateParser}
            selectedValue={selectedValue}
          />}
          {["vsource", "load", "dr_load", "flex_gen", "flex_load", "mismatch"].includes(selectedValue) &&
          <LineChartPQS 
            margin={margin} 
            data={data} 
            y_extent={y_extent} 
            colorScale={colorScale}
            time={props.data["time"]}
            dateParser={dateParser}
          />}
        </div>
      </div>
    </>
  )
};
