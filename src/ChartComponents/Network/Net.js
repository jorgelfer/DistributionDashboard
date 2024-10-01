import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';

export default function Net(props) {

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);

    // Handlers for drag events on nodes
    // Drag events adjust the [fx,fy] of the nodes to override the simulation
    function dragstarted(event,d) {
      d3.select(this).classed("fixed", true);
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

    let drag = d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);

    // Append weighted lines for each link in network
    console.log(props.data.branch);
    const linkEnter = networkContainer 
      .selectAll('.link')
      .data(props.data.branch)
        .join('line')
          .attr('class', 'link')
          .attr('stroke-width', d => props.linkScale(d.f_connections.length));

    // Append circles for each node in the graph
    const nodeEnter = networkContainer 
    .selectAll('.node')
      .data(props.data.bus)
      .join('circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length))
        .attr('class', 'node')
        .call(drag); // Call drag object to setup all drag listeners for nodes

    // Append icons for each node in the graph
    // console.log(props.selectedValue);
    const pathEnter = networkContainer 
    .selectAll('.symbol')
        .data(props.data.bus)
        .join("path")
            .attr("d", d3.symbol()
              .size(200)
              .type(Symbol(props.selectedValue)))
            .attr('class', 'symbol')
            .attr("stroke", "black")
            .attr("fill", "black")
            .style("visibility", "visible")
            .lower();

    function tickSimulation() {
      linkEnter
        .attr('x1', d => props.xScale(d.source.x))
        .attr('y1', d => props.yScale(d.source.y))
        .attr('x2', d => props.xScale(d.target.x))
        .attr('y2', d => props.yScale(d.target.y));

      nodeEnter
        .attr('cx', d => props.xScale(d.x))
        .attr('cy', d => props.yScale(d.y));

      pathEnter
          .attr('transform', function(d) { return `translate(${props.xScale(d.x)+10}, ${props.yScale(d.y)+10})`;});
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

  }, [props]);

    return (
      <g 
      ref={networkRef}
      />
    );
};