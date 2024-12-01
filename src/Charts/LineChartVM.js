// import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import ChartContainer from '../ChartComponents/ChartContainer';
import Card from '../UI/Card/Card';
import Curve from '../ChartComponents/Curve';
import Axis from '../ChartComponents/Axis';

export default function LineChartVM(props) {
  const width = 400;
  const height = 245;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;

  // group data
  const sumstat = d3.group(props.data.flat(), d => d.uid);

  // get array of uids
  var uids = Array.from(sumstat.keys()); // list of group names

  // scales 
  const xScale = d3.scaleTime()   
    .domain(d3.extent(props.time, d => props.dateParser(d)))   
    .range([0, innerWidth]);

  const formatTime = d3.timeFormat("%H")
  const yScale = d3.scaleLinear()
    .domain(props.y_extent)
    .range([innerHeight, 0]);

  return(
    <Card>
      <h2>Voltage Magnitude</h2>
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
        className="line-chart"
      >
        <Axis 
          type="time"
          time={props.time}
          dateParser={props.dateParser}
          formatTime={formatTime}
          scale={xScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          label={"Time [h]"}
        />
        <Axis 
          type="left"
          scale={yScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          label="Voltage Magnitude [p.u.]"
        />
        {uids.map((uid, i) => (
          <g key={`line-${uid}`}>
            <Curve
              data={sumstat.get(uid)}
              xScale={xScale}
              yScale={yScale}
              xAccessor="time"
              yAccessor="val"
              stroke={props.colorScale(sumstat.get(uid)[0].phase)}
              strokeWidth={2}
            />
          </g>
        ))}
      </ChartContainer> 
    </Card>
  );
}