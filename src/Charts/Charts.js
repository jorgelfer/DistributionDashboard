import * as d3 from 'd3';

import LineChart from './LineChart';
import NetworkGraph from './NetworkGraph';
import Header from '../UI/Header';

export default function Charts(props) {
  const margin = {top: 30, right: 10, bottom: 50, left: 60};

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const dateParser = d3.timeParse("%Y-%m-%dT%H:%M");

  const time_extent = d3.extent(props.data["time"], d => dateParser(d))

  return (
    <>
      <div className="main">
        <Header />
      </div>
      <h1>Distribution Dashboard</h1>
      <div className='wrapper'>
        <div className='one'>
          <NetworkGraph 
            margin={margin} 
            data={props.data} 
            colorScale={colorScale}
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
