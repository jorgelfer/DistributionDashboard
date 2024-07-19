import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function Net(props) {

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);

    // initialize simulation
    const simulation = d3.forceSimulation()
      .alpha(1).restart()
      .force('link', d3.forceLink().id(d => d.uid))
      .force('charge', d3.forceManyBody());

    // Append weighted lines for each link in network
    const linkEnter = networkContainer 
      .selectAll('.link')
      .data(props.data.branch)
        .join('line')
          .attr('class', 'link')
          .attr('stroke-width', d => props.linkScale(d.phases.length));

    // Append circles for each node in the graph
    const nodeEnter = networkContainer 
    .selectAll('.node')
      .data(props.data.bus)
      .join('circle')
        .attr("r", props.originalNodeSize)
        .style('fill', d => props.colorScale(d.phases.length))
        .attr('class', 'node');

    // Set up the nodes for the simulation
    // Note this has to be done before we set up the links in the next block
    simulation
      .nodes(props.data.bus)
      .on('tick', tickSimulation);

    // Set up the links and what type of force will be used for the simulation
    // Again note that this has to be done in a separate block from above
    simulation
      .force('link')
      .links(props.data.branch);

    // Different layers
    if (props.activeLayer === 'coordinates') {
        // Stop link simulation (to keep original node positons)
        simulation.force("link", null);
        simulation.force("charge", null);
    } else {
        // stop node charge 
        simulation.force("charge", null);
    }

    function tickSimulation() {
      linkEnter
        .attr('x1', d => props.xScale(d.source.x))
        .attr('y1', d => props.yScale(d.source.y))
        .attr('x2', d => props.xScale(d.target.x))
        .attr('y2', d => props.yScale(d.target.y));

      nodeEnter
        .attr('cx', d => props.xScale(d.x))
        .attr('cy', d => props.yScale(d.y));
    }

  }, [props]);

    return (
      <g 
        ref={networkRef}
      />
    );
};