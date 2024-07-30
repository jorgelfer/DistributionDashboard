import * as d3 from 'd3';

import LineChart from './LineChart';
import NetworkGraph from './NetworkGraph';
// import Symbol from '../ChartComponents/Network/Symbol';


// Header
import React from "react";
import { useState } from "react";

import './Charts.css';
import { DATADISPLAY } from "./data.js";

function DataDisplay({children, onClick, isSelected}) {
  return (
    <li className={isSelected ? "main-tab active" : "main-tab"} onClick={onClick}>
      <img src={children.image} alt={children.title} />
      <p>{children.title}</p>
    </li>
  );
}

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

  return (
    <>
      <div id="main-header">
        <ul>
          {Object.keys(DATADISPLAY).map((objKey) => 
            <DataDisplay key={objKey} isSelected={selectedValue === objKey}
            onClick={() => handleClick(objKey)}>
              {DATADISPLAY[objKey]}
            </DataDisplay>
          )}
        </ul>
      </div>
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
            data={props.data} 
            colorScale={colorScale}
            time_extent={time_extent}
            dateParser={dateParser}
          />
        </div>
      </div>
    </>
  )
};
