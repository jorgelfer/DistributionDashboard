import React from "react";
import { useState } from "react";
import * as d3 from 'd3';
import Header from "../UI/Header/Header";
import LineChartVM from './LineChartVM';
import LineChartPQS from './LineChartPQS';
import LineChartBSS from './LineChartBSS';
import NetworkGraph from './NetworkGraph';
import { updateData } from "../Data/update";

export default function Charts(props) {

  const margin = {top: 30, right: 30, bottom: 50, left: 70};
  var colorScale = d3.scaleQuantile()
      .domain([0,1,2,3,4])
      .range(["red","#f28e2c", "#59a14f", "#4e79a7","red"]);

  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");

  // Header
  const [selectedValue, setSelectedValue] = useState('vsource');
  function handleClick(selectedButton) {
    if (selectedValue !== selectedButton) {
      setSelectedValue(selectedButton);
    }
  }

  // selected buses
  const [selectedBuses, setSelectedBuses] = useState({
    selectedBus: null,
    buses: [],
  });

  function handleSelectBus(buses) {
    setSelectedBuses((prevBuses) => ({
      ...prevBuses,
      buses: buses
    }));
  };

  const [vdata, vextent, data, y_extent] = updateData(props.data, selectedValue, selectedBuses, dateParser);

  return (
    <>
      <Header handleClick={handleClick} selectedValue={selectedValue} />
      <h1 className='main-title'>Distribution System Dashboard</h1>
      <div ref={props.printRef} className='row'>
        <div className='col-9'>
          <NetworkGraph 
            margin={margin} 
            data={props.data} 
            colorScale={colorScale}
            selectedValue={selectedValue}
            onSelectBus={handleSelectBus}
          />
          {selectedBuses.buses.length > 0 && 
          <p className="form-actions">
            <button className="login-button" onClick={() => handleSelectBus([])}>Release</button>
          </p>}
        </div>
        <div className='col-3'>
          <div className='row'>
            <div className='col-12'>
              <LineChartVM 
                margin={margin} 
                data={vdata} 
                y_extent={vextent} 
                colorScale={colorScale}
                time={props.data["time"]}
                dateParser={dateParser}
                selectedValue={selectedValue}
              />
            </div>
            <div className='col-12'>
              {["battery"].includes(selectedValue) &&
              <LineChartBSS 
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
                selectedValue={selectedValue}
              />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
