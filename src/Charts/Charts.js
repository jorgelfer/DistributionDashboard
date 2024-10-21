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
  // const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  // const colorScale = d3.scaleOrdinal(["#f28e2c", "#59a14f", "#4e79a7"]);
  var colorScale = d3.scaleQuantile()
      .domain([1,2,3])
      .range(["#f28e2c", "#59a14f", "#4e79a7"]);
  // ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");

  // Header
  const [selectedValue, setSelectedValue] = useState('vm');
  function handleClick(selectedButton) {
    if (selectedValue !== selectedButton) {
      setSelectedValue(selectedButton);
    }
  }

  // console.log(props.data);
  const [data, y_extent] = updateData(props.data, selectedValue, dateParser);
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
          />
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
