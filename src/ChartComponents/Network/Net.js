import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';
import InitDevice from './InitDevice';
import styles from './Net.module.css';

export default function Net(props) {

  const networkRef = useRef();
  useEffect(() => {

    d3.selectAll(".node").remove();
    d3.selectAll(".link").remove();
    d3.selectAll("#graph-tooltip").remove();

    const networkContainer = d3.select(networkRef.current);

    // active nodes
    var active_nodes = [];
    if (!["vm", "flow", "mismatch"].includes(props.selectedValue)) {
      if (props.data[`${props.selectedValue}`]) {
        active_nodes = props.data[`${props.selectedValue}`].map(d => d.bus);
      }
    } 
    // Set the domain of the x and y scales
    props.xScale.domain(d3.extent(props.data.bus, d => d.x));
    props.yScale.domain(d3.extent(props.data.bus, d => d.y));

    // Add the tooltip element to the graph
    const tooltip = document.querySelector("#graph-tooltip");
    if (!tooltip) {
      const tooltipDiv = document.createElement("div");
      tooltipDiv.classList.add(styles.tooltip);
      tooltipDiv.style.display = "none";
      tooltipDiv.id = "graph-tooltip";
      document.body.appendChild(tooltipDiv);
    }
    const div = d3.select("#graph-tooltip");

    const addTooltip = (hoverTooltip, event, d) => {
      div
        .transition()
        .duration(200)
        .style("display", "block");
      div
        .html(hoverTooltip(d))
        .style("left", `${event.x}px`)
        .style("top", `${event.y - 50}px`);
    };

    const removeTooltip = () => {
      div
        .transition()
        .duration(200)
        .style("display", "none");
    };

    window.onkeydown = function(event) {
      if (event.key === "Escape") {
        removeTooltip();
      } else if (event.key === "Enter") {

        // get updated device
        const inputBus = d3.select("#bus").property("value");
        let device = props.data[`${props.selectedValue}`].find(f => f.bus === inputBus);

        // update device information
        if (props.selectedValue === "battery") {
          device.capacity = d3.select("#capacity").property("value");
          device.charging_limit = d3.select("#charging_limit").property("value");
          device.efficiency = d3.select("#efficiency").property("value");
          device.initial_energy = d3.select("#initial_energy").property("value");
          device.final_energy = d3.select("#initial_energy").property("value");
          device.cost = d3.select("#cost").property("value");
          device.revenue = d3.select("#cost").property("value");
          device.phases = d3.select("#terminals").property("value").split(',').map(Number);;
        } else {
          device.power_rating = d3.select("#power_rating").property("value");
          device.cost = d3.select("#cost").property("value");
          device.phases = d3.select("#terminals").property("value").split(',').map(Number);;
        }

        console.log(device);

        // update original data
        props.updateData(props.data);

        // remove the tooltip
        removeTooltip();
      }
    };

    // Append weighted lines for each link in network
    // console.log(props.data.branch);
    const linkEnter = networkContainer 
      .selectAll('.link')
      .data(props.data.branch)
        .join('line')
          .attr('class', 'link')
          .attr('stroke-width', d => props.linkScale(d.f_connections.length));
      
    let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    
    var nodeEnter = networkContainer
      .selectAll(".node")
      .data(props.data.bus)
      .join("g")
        .attr("class", "node")
        .on("dblclick", node_dblclick)
        .call(drag); // Call drag object to setup all drag listeners for nodes

    // Append circles for each node in the graph
    nodeEnter
      .append('circle')
        .attr('class', 'circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length));

    nodeEnter
    .append("image")
      .attr("class", "symbol")
      .attr("xlink:href", Symbol(props.selectedValue))
      .attr("transform", "translate(5,5)")
      .attr("width", 25)
      .attr("height", 25)
      .style("display", d => active_nodes.includes(d.uid) ? "block" : "none")
      .on("click", (event, d) => {
        if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
          addTooltip(props.deviceTooltip, event, d);
        }
      });

    function tickSimulation() {
      linkEnter
        .attr('x1', d => props.xScale(d.source.x))
        .attr('y1', d => props.yScale(d.source.y))
        .attr('x2', d => props.xScale(d.target.x))
        .attr('y2', d => props.yScale(d.target.y));

      nodeEnter
          .attr('transform', function(d) { return `translate(${props.xScale(d.x)}, ${props.yScale(d.y)})`;});
    }
    
    // initialize simulation
    var simulation = d3.forceSimulation()
      .alpha(1).restart()
      .force("charge", d3.forceManyBody())
      .force('link', d3.forceLink().id(d => d.uid))
      .nodes(props.data.bus)
      .on('tick', tickSimulation);

    // Set up the links and what type of force will be used for the simulation
    // Again note that this has to be done in a separate block from above
    simulation
      .force('link')
      .links(props.data.branch);

    if (props.activeLayer === 'coordinates') {
      simulation.force("link", null);
      simulation.force("charge", null);
    }

    // Handlers for click events on nodes
    function node_dblclick(event, d) {

      if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {

        // ---------------------------------------
        if (d3.select(this).classed("fixed")) {
          // remove the fixed class
          d3.select(this).classed("fixed", false);

          // hide the symbol
          d3.select(this).select("image.symbol")
            .style("display", "none");

          // remove the tooltip
          removeTooltip();

          // Remove the device from array
          props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`].filter(f => f.bus !== d.uid);

          // update original data
          props.updateData(props.data);

        } else {
          // add the fixed class
          d3.select(this).classed("fixed", true);

          // show the symbol
          d3.select(this).select("image.symbol")
            .style("display", "block");

          // create the new device
          props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`] || [];

          // check if the device already exists
          let device = props.data[`${props.selectedValue}`].find(f => f.bus === d.uid);
          if (device === undefined) {
            // append new device to the flex_devices array
            props.data[`${props.selectedValue}`].push(InitDevice(props.selectedValue, d.uid, props.data.time.length));
          };

          // update original data
          props.updateData(props.data);

        };
        // ---------------------------------------

      };
    };

    // Handlers for drag events on nodes
    // Drag events adjust the [fx,fy] of the nodes to override the simulation
    function dragstarted(event,d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event,d) {
      // get the x and y position of the svg
      const [xs, ys] = d3.pointer(event, d3.select(".network-graph").node());
      d.fx = props.xScale.invert(xs - props.margin.left);
      d.fy = props.yScale.invert(ys - props.margin.top);
    };

    function dragended(event,d) {
      if (!event.active) simulation.alphaTarget(0);
      // Keeping the [fx,fy] at the dragged positioned will pin it
      // Setting to null allows the simulation to change the [fx,fy]
      d.fx = null;
      d.fy = null;
    };

  }, [props]);

    return (
      <g 
      ref={networkRef}
      />
    );
};