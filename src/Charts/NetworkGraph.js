import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

import Card from '../UI/Card';
import ChartContainer from '../ChartComponents/ChartContainer';

export default function NetworkGraph(props) {
  const width = 700;
  const height = 500;
  const innerWidth = width - props.margin.left - props.margin.right;
  const innerHeight = height - props.margin.top - props.margin.bottom;
  const originalNodeSize = 4;

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);

    // scales
    const linkScale = d3.scaleSqrt()
      .domain(d3.extent(props.data.branch, function (d) { return d.phases.length; }))
      .range([3, 7]);

    // initialize scales
    const x_net = d3.scaleLinear()
      .range([0, innerWidth]);

    const y_net = d3.scaleLinear()
      .range([innerHeight, 0]);

    // initialize simulation
    const simulation = d3.forceSimulation()
      .alpha(1).restart()
      .force('link', d3.forceLink().id(function (d) { return d.uid; }))
      .force('charge', d3.forceManyBody());

    // Create a group for links
    const linkG = networkContainer
      .append('g')
        .attr('class', 'linksGroup');

    // create a group for the the nodes
    const nodeG = networkContainer
      .append('g')
        .attr('class', 'nodeGroup');

    // Append weighted lines for each link in network
    const linkEnter = linkG 
      .selectAll('.link')
      .data(props.data.branch)
        .join('line')
          .attr('class', 'link')
          .attr('stroke-width', d => linkScale(d.phases.length));

    // Append circles for each node in the graph
    const nodeEnter = nodeG 
    .selectAll('.node')
      .data(props.data.bus)
      .join('circle')
        .attr("r", originalNodeSize)
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

    // initially no forces
    simulation.force("link", null);
    simulation.force("charge", null);

    // Update network after forces have been applied 
    x_net.domain([0, d3.max(props.data.bus, function (d) { return d.x; } )]);
    y_net.domain([0, d3.max(props.data.bus, function (d) { return d.y; } )]);

    function tickSimulation() {

      linkEnter
        .attr('x1', function (d) { return x_net(d.source.x); })
        .attr('y1', function (d) { return y_net(d.source.y); })
        .attr('x2', function (d) { return x_net(d.target.x); })
        .attr('y2', function (d) { return y_net(d.target.y); });

      nodeEnter
        .attr('cx', function (d) { return x_net(d.x); })
        .attr('cy', function (d) { return y_net(d.y); });
    }

  }, [innerWidth, innerHeight, originalNodeSize, props]);

  return(
    <Card>
      <h2>Network</h2>
      <ChartContainer
        width={width}
        height={height}
        margin={props.margin}
      >
        <g ref={networkRef} />
      </ChartContainer> 
    </Card>
  );
}