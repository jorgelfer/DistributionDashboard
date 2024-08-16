import React from "react";
import { useState } from "react";

import * as d3 from 'd3';

import Header from "../UI/Header/Header";
import LineChart from './LineChart';
import NetworkGraph from './NetworkGraph';

import { updateData } from "../Data/update";

export default function Charts(props) {

  const margin = {top: 30, right: 10, bottom: 50, left: 60};
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");
  const time_extent = d3.extent(props.data["time"], d => dateParser(d))

  // Header
  const [selectedValue, setSelectedValue] = useState('vm');

  function handleClick(selectedButton) {
    if (selectedValue !== selectedButton) {
      setSelectedValue(selectedButton);
    }
  }

  // console.log(props.data);
  const [data, y_extent] = updateData(props.data, selectedValue, dateParser);
  // console.log(data);

  // const sumstat = d3.group(data.flat(), d => d.uid);
  // sumstat.forEach((value, key) => console.log(key));
  // console.log(sumstat.get("sourcebus.1"));

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
          <LineChart 
            margin={margin} 
            data={data} 
            y_extent={y_extent} 
            colorScale={colorScale}
            time_extent={time_extent}
            dateParser={dateParser}
          />
        </div>
      </div>
    </>
  )
};
