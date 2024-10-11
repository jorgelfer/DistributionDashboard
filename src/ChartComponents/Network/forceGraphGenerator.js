import * as d3 from "d3";
import styles from "./forceGraph.module.css";

export function runForceGraph(
  {container,
  nodeHoverTooltip,
  props}
) {

  const networkContainer = d3.select(container);

  // Set the domain of the x and y scales
  props.xScale.domain(d3.extent(props.data.bus, d => d.x));
  props.yScale.domain(d3.extent(props.data.bus, d => d.y));

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0);
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
// 
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
    .style("display", "none")
    .on("mouseover", (d) => {
      addTooltip(nodeHoverTooltip, d, props.innerWidth, props.innerHeight);
    })
    .on("mouseout", () => {
      removeTooltip();
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

    if (d3.select(this).classed("fixed")) {
      d3.select(this).classed("fixed", false);

      d3.select(this).select("image.symbol")
        .style("display", "none");
      
      // Remove the device from the flex_devices array
      props.data.flex_devices = props.data.flex_devices.filter(f => f.bus !== d.bus);

    } else {
      d3.select(this).classed("fixed", true);
      d3.select(this).select("image.symbol")
        .style("display", "block");

      // append new device to the flex_devices array
      props.data.flex_devices.push({
        uid: `fl_${d.uid}`,
        bus: d.uid,
        power_rating: 10,
        power_cost: 0.1,
        terminals: [1, 2, 3]
      });
    }

    console.log(props.data.flex_devices);
  }

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

  // return the destroy function  
  return {
    destroy: () => {
      simulation.stop();
    },
  };

}