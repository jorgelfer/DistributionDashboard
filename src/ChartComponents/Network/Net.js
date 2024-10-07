import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';
import d3Tip from 'd3-tip'

import batteryImg from "../../assets/battery.png";
import demand_responseImg from "../../assets/demand_response.png";
import demandImg from "../../assets/demand.png";
import flowsImg from "../../assets/flows.png";
import mismatchImg from "../../assets/mismatch.png";
import solarImg from "../../assets/solar.png";
import voltageImg from "../../assets/voltage.png";

export default function Net(props) {

  let selectedValue = props.selectedValue;

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);

    // Set the domain of the x and y scales
    props.xScale.domain(d3.extent(props.data.bus, d => d.x));
    props.yScale.domain(d3.extent(props.data.bus, d => d.y));

    function handleSubmitForm(event) {
      event.preventDefault();
      const form = event.target;
      const power_rating = form.power_rating.value;
      const power_cost = form.power_cost.value;
      const terminals = form.terminals.value;

      console.log(power_rating, power_cost, terminals);
    }

    // Tooltip definition
    let toolTip = d3Tip()
        .attr("class", "d3-tip")
        .offset([0, 120])
        .html(function (event, d) {
            return (
              `<form onsubmit=${handleSubmitForm}>
                <h2 class="login-header">${selectedValue} - ${d.uid}</h2>
                <div class="control no-margin">
                  <label for="power_rating">Power Rating [kW]</label>
                  <input 
                  id="power_rating" 
                  type="text" 
                  name="power_rating" 
                  />
                </div>
                <div class="control no-margin">
                  <label for="power_cost">Cost [$/kWh]</label>
                  <input 
                  id="power_cost" 
                  type="text" 
                  name="power_cost" 
                  />
                </div>
                <div class="control no-margin">
                  <label for="terminals">Terminals</label>
                  <input 
                  id="terminals" 
                  type="text" 
                  name="terminals" 
                  />
                </div>
                <p class="form-actions">
                  <button type="reset" class="login-button button-flat">Cancel</button>
                  <button class="login-button">Submit</button>
                </p>
              </form>`
            );
        });

    // Call tooltip to initialize it to document and svg
    networkContainer.call(toolTip);

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

    const tan30 = Math.sqrt(1 / 3);
    const tan30_2 = tan30 * 2;
    // var plane_d = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47"
    const symbolStar = {
      draw(context, size) {
        context.moveTo(38.800781, 4);
        context.bezierCurveTo(38.018781, 4, 37.269359, 4.3175781, 36.693359, 4.8925781);
        context.lineTo(33.59375, 7.9921875);
        context.bezierCurveTo(33.19475, 8.3901875, 33, 8.8513906, 33, 9.4003906);
        context.lineTo(33, 10);
        context.lineTo(13, 10);
        context.bezierCurveTo(5.8545455, 10, 0, 15.854545, 0, 23);
        context.lineTo(0, 34);
        context.bezierCurveTo(0, 35.645455, 1.3545455, 37, 3, 37);
        context.lineTo(4, 37);
        context.lineTo(4, 39);
        context.bezierCurveTo(4, 40.654, 5.346, 42, 7, 42);
        context.lineTo(8.2148438, 42);
        context.bezierCurveTo(8.8723801, 44.301307, 10.994575, 46, 13.5, 46);
        context.bezierCurveTo(16.357053, 46, 18.719773, 43.793358, 18.974609, 41);
        context.lineTo(34.025391, 41);
        context.bezierCurveTo(34.280227, 43.793358, 36.642947, 46, 39.5, 46);
        context.bezierCurveTo(42.005425, 46, 44.12762, 44.301307, 44.785156, 42);
        context.lineTo(47, 42);
        context.bezierCurveTo(48.654, 42, 50, 40.654, 50, 39);
        context.lineTo(50, 34.173828);
        context.bezierCurveTo(50, 31.964828, 48.418281, 30.097375, 46.238281, 29.734375);
        context.lineTo(38.589844, 28.103516);
        context.lineTo(35.009766, 23.09375);
        context.bezierCurveTo(34.072341, 21.780105, 32.554637, 21, 30.941406, 21);
        context.lineTo(17.544922, 21);
        context.bezierCurveTo(16.25394, 21, 15.03917, 21.623946, 14.289062, 22.673828);
        context.lineTo(10.412109, 28.101562);
        context.lineTo(7.796875, 28.646484);
        context.bezierCurveTo(5.454875, 29.134484, 4, 30.942187, 4, 33.367188);
        context.lineTo(4, 35);
        context.lineTo(3, 35);
        context.bezierCurveTo(2.4454545, 35, 2, 34.554545, 2, 34);
        context.lineTo(2, 23);
        context.bezierCurveTo(2, 16.945455, 6.9454545, 12, 13, 12);
        context.lineTo(33, 12);
        context.lineTo(33, 12.599609000000001);
        context.bezierCurveTo(33, 13.148609, 33.19475, 13.608813, 33.59375, 14.007812);
        context.lineTo(36.691406, 17.107422);
        context.bezierCurveTo(37.268406, 17.683422, 38.018781, 18, 38.800781, 18);
        context.lineTo(43, 18);
        context.bezierCurveTo(44.159, 18, 45, 17.159, 45, 16);
        context.lineTo(50, 16);
        context.lineTo(50, 14);
        context.lineTo(45, 14);
        context.lineTo(45, 8);
        context.lineTo(50, 8);
        context.lineTo(50, 6);
        context.lineTo(45, 6);
        context.bezierCurveTo(45, 4.841, 44.159, 4, 43, 4);
        context.lineTo(38.800781, 4);
        context.closePath();
        context.moveTo(17.544922, 23);
        context.lineTo(23, 23);
        context.lineTo(23, 28);
        context.lineTo(12.943359000000001, 28);
        context.lineTo(15.916015999999999, 23.837891);
        context.bezierCurveTo(16.29191, 23.311772, 16.897903, 23, 17.544922, 23);
        context.closePath();
        context.moveTo(25, 23);
        context.lineTo(30.941406, 23);
        context.bezierCurveTo(31.910175, 23, 32.820238, 23.467504, 33.382812, 24.255859);
        context.lineTo(36.056641, 28);
        context.lineTo(25, 28);
        context.lineTo(25, 23);
        context.closePath();
        context.moveTo(13.5, 37);
        context.bezierCurveTo(15.444841, 37, 17, 38.555159, 17, 40.5);
        context.bezierCurveTo(17, 42.444841, 15.444841, 44, 13.5, 44);
        context.bezierCurveTo(11.555159, 44, 10, 42.444841, 10, 40.5);
        context.bezierCurveTo(10, 38.555159, 11.555159, 37, 13.5, 37);
        context.closePath();
        context.moveTo(39.5, 37);
        context.bezierCurveTo(41.444841, 37, 43, 38.555159, 43, 40.5);
        context.bezierCurveTo(43, 42.444841, 41.444841, 44, 39.5, 44);
        context.bezierCurveTo(37.555159, 44, 36, 42.444841, 36, 40.5);
        context.bezierCurveTo(36, 38.555159, 37.555159, 37, 39.5, 37);
        context.closePath();
      }
    };

    // nodeEnter
    //   .append("path")
    //     .attr("class", "symbol")
    //     .attr("stroke", "black")
    //     .attr("fill", "black")
    //     .attr("transform", "translate(5,5)")
    //     .attr("d", d3.symbol()
    //       .size(10)
    //       .type(symbolStar)
    //     )
    //     .on('click', toolTip.show)
    //     .style("display", "none");
    nodeEnter
    .append("image")
      .attr("class", "symbol")
      .attr("xlink:href", batteryImg)
      .attr("transform", "translate(5,5)")
      .attr("width", 20)
      .attr("height", 20)
      .on('click', toolTip.show)
      .style("display", "none");

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

      } else {
        d3.select(this).classed("fixed", true);
        d3.select(this).select("image.symbol")
          .style("display", "block");
      }

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

  }, [selectedValue, props]);

    return (
      <g 
      ref={networkRef}
      />
    );
};