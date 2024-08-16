import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import ChartContainer from '../ChartComponents/ChartContainer';
import Card from '../UI/Card/Card';
import Curve from '../ChartComponents/Curve';

export default function LineChart(props) {
  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;

  // group data
  const sumstat = d3.group(props.data.flat(), d => d.uid);

  // scales 
  const xScale = d3.scaleTime()   
    .domain(props.time_extent)   
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain(props.y_extent)
    .range([innerHeight, 0]);

  // const LineChartRef = useRef();
  // useEffect(() => {
  //   const LineChartContainer = d3.select(LineChartRef.current);


  //   // vm line chart axis text
  //   const title_vm = LineChartContainer
  //     .append('text')
  //       .attr('class', 'title_2')
  //       .attr('font-weight', 900)
  //       .attr('transform', `translate(${innerWidth/2}, ${props.margin.top/2})`);

  //   const xLabel_vm = LineChartContainer
  //     .append("text")
  //       .attr("class", "x_label_vm")
  //       .attr("text-anchor", "end")
  //       .attr("y", innerHeight + props.margin.bottom)
  //       .attr("x", (width/2));

  //   const yLabel_vm = LineChartContainer
  //     .append("text")
  //       .attr("class", "y_label_vm")
  //       .attr("text-anchor", "end")
  //       .attr("y", - (props.margin.left))
  //       .attr("x", - (innerHeight/2))
  //       .attr("dy", "1.5em")
  //       .attr("transform", "rotate(-90)");

  //   // update axis text
  //   title_vm.text("Voltage magnitude")
  //   yLabel_vm.text("Voltage [p.u.]")
  //   xLabel_vm.text("Time [h]")

  //    // Draw the line
  //   LineChartContainer
  //     .selectAll(".line")
  //       .data(sumstat)
  //       .join("path")
  //         .attr("fill", "none")
  //         .attr("stroke", d => props.colorScale(d[1][0].phase)) // first element of sumstat is the phase
  //         .attr("stroke-width", 1.5)
  //         .attr("d", function(d){
  //         return d3.line()
  //           .x(d => x_vm(d.time))
  //           .y(d => y_vm(+d.val))
  //           (d[1])
  //         })   

  //   // Axis
  //   LineChartContainer
  //     .append("g")
  //       .attr("class", "xaxis")
  //       .attr('transform', `translate(0, ${innerHeight})`)
  //       .call(d3.axisBottom(x_vm))
  //       .selectAll("text")
  //       .attr("transform", "translate(-10,0)rotate(-45)")
  //       .style("text-anchor", "end");

  //   LineChartContainer
  //     .append("g")
  //       .attr("class", "yaxis")
  //       .call(d3.axisLeft(y_vm));
  // }, [innerWidth, innerHeight, sumstat, props]);

  // sumstat.forEach((value, key) => console.log(key));

  // get array of uids
  var uids = Array.from(sumstat.keys()); // list of group names

  return(
    <Card>
      <h2>Operation Values</h2>
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
        className="line-chart"
      >
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