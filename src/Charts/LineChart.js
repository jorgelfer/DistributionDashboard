import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import ChartContainer from '../ChartComponents/ChartContainer';
import Card from '../UI/Card';

export default function LineChart(props) {
  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;

  const LineChartRef = useRef();
  useEffect(() => {
    const LineChartContainer = d3.select(LineChartRef.current);

    // scales 
    const x_vm = d3.scaleTime()   
        .range([0, innerWidth])

    const y_vm = d3.scaleLinear()
        .range([innerHeight, 0])

    // vm line chart axis text
    const title_vm = LineChartContainer
      .append('text')
        .attr('class', 'title_2')
        .attr('font-weight', 900)
        .attr('transform', `translate(${innerWidth/2}, ${props.margin.top/2})`);

    const xLabel_vm = LineChartContainer
      .append("text")
        .attr("class", "x_label_vm")
        .attr("text-anchor", "end")
        .attr("y", innerHeight + props.margin.bottom)
        .attr("x", (width/2));

    const yLabel_vm = LineChartContainer
      .append("text")
        .attr("class", "y_label_vm")
        .attr("text-anchor", "end")
        .attr("y", - (props.margin.left))
        .attr("x", - (innerHeight/2))
        .attr("dy", "1.5em")
        .attr("transform", "rotate(-90)");

    // update axis text
    yLabel_vm.text("Voltage [p.u.]")
    title_vm.text("Voltage magnitude")

    // organize data
    const data_vm = []

    props.data.bus.forEach((d, i) => {
        d["phases"].forEach((d2, i2) => {
            data_vm.push(d.vm[d2.toString()].map((d3, i3) =>({
                "time": props.dateParser(props.data['time'][i3]),
                "val": +d3 / (+d.kV_base * 1000),
                "phase": d2.toString(),
                "bus": d.uid,
                "uid": d.uid + "." + d2.toString(),
            })));
        })
    })

    // // push lower limit 
    // const vm_lb = 1 - (isNaN(props.data["ansi"]) ? 0.05 : +props.data["ansi"])
    // props.data["time"].forEach((d, i) => {
    //     data_vm.push({
    //         "time": props.dateParser(d),
    //         "val":  vm_lb,
    //         "phase": "0",
    //         "uid": "lb" + "." + "0",
    //     });
    // })

    // // push upper limit 
    // const vm_ub = 1 + (isNaN(props.data["ansi"]) ? 0.05 : +props.data["ansi"])
    // props.data["time"].forEach((d, i) => {
    //     data_vm.push({
    //         "time": props.dateParser(d),
    //         "val": vm_ub,
    //         "phase": "4",
    //         "uid": "ub" + "." + "0",
    //     });

    // vertical scale 
    y_vm.domain([0.94, 1.06]);
    x_vm.domain(props.time_extent);   

    const sumstat = d3.group(data_vm.flat(), d => d.uid);

    // update axis text
    xLabel_vm.text("Time [h]")

     // Draw the line
    LineChartContainer
      .selectAll(".line")
        .data(sumstat)
        .join("path")
          .attr("fill", "none")
          .attr("stroke", d => props.colorScale(d[1][0].phase)) // first element of sumstat is the phase
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
          return d3.line()
            .x(d => x_vm(d.time))
            .y(d => y_vm(+d.val))
            (d[1])
          })   

    // Axis
    LineChartContainer
      .append("g")
        .attr("class", "xaxis")
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x_vm))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    LineChartContainer
      .append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y_vm));
  }, [innerWidth, innerHeight, props]);

  return(
    <Card>
      <h2>Operation Values</h2>
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
      >
        <g ref={LineChartRef} />
      </ChartContainer> 
    </Card>
  );
}