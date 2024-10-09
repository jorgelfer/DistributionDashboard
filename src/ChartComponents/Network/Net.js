import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';
import d3Tip from 'd3-tip'

export default function Net(props) {

  const networkRef = useRef();
  useEffect(() => {

    d3.selectAll(".node").remove();
    d3.selectAll(".link").remove();
    d3.selectAll(".d3-tip").remove();

    const networkContainer = d3.select(networkRef.current);

    // Set the domain of the x and y scales
    props.xScale.domain(d3.extent(props.data.bus, d => d.x));
    props.yScale.domain(d3.extent(props.data.bus, d => d.y));

    function handleSubmitForm(event) {
      event.preventDefault();
      // let form = event.target;
      // let power_rating = form.power_rating.value;
      console.log(event);
    }

    // Tooltip definition
    let toolTip = d3Tip()
      .attr("class", "d3-tip")
      .offset([0, 120])
      .html(function (event, d) {
        return (
          `<form onsubmit="${handleSubmitForm}">
            <p>
              <label for="name">Name:</label>
              <input type="text" id="name" name="user_name" />
            </p>
            <p class="button">
              <button>Submit</button>
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

    nodeEnter
    .append("image")
      .attr("class", "symbol")
      .attr("xlink:href", Symbol(props.selectedValue))
      .attr("transform", "translate(5,5)")
      .attr("width", 25)
      .attr("height", 25)
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

  }, [props]);

    return (
      <g 
      ref={networkRef}
      />
    );
};