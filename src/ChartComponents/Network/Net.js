import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';

export default function Net(props) {

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);
    
    const curve = d3.line()
        .curve(d3.curveCardinalClosed.tension(.85));

    function getBus(n) { return n.bus; }

    var radius = 4,      // default point radius
        hull_offset = 15,    // cluster hull offset
        collapse = {}, // collapsed clusters
        node_map = {},       // node map
        data, 
        net, 
        simulation;

    // constructs the network to visualize
    function network(data, prev, index, collapse) {
      collapse = collapse || {};
      let bus_map = {},    // bus map
          link_map = {},    // link map
          bus_nodes = {},    // previous bus nodes
          bus_centroids = {},    // previous bus centroids
          net_nodes = [], // output nodes
          net_links = []; // output links

      node_map = {}    // reset node map
        
      // process previous network by reusing nodes for centroid calculation
      if (prev) {
        prev.nodes.forEach(n => {
          let i = index(n), o;
          if (n.size > 0) {
            bus_nodes[i] = n;
            n.size = 0;
          } else {
            o = bus_centroids[i] || (bus_centroids[i] = {x:0, y:0, count:0});
            o.x += n.x;
            o.y += n.y;
            o.count += 1;
          }
        });
      }

      // determine nodes
      data.nodes.forEach(n => {
        let i = index(n),
            l = bus_map[i] || 
            (bus_map[i] = bus_nodes[i]) || 
            (bus_map[i] = {uid:i.toString(), bus:i, size:0, nodes:[]});

        if (collapse[i] !== true) {
          // the node should be directly visible
          node_map[n.uid] = net_nodes.length;
          net_nodes.push(n);
          if (bus_nodes[i]) {
            // place new nodes at cluster location (plus jitter)
            n.x = bus_nodes[i].x + Math.random();
            n.y = bus_nodes[i].y + Math.random();
          }
        } else {
          // the node is part of a collapsed cluster
          if (l.size == 0) {
            // if new cluster, add to set and position at centroid of leaf nodes
            node_map[i] = net_nodes.length;
            net_nodes.push(l);
            if (bus_centroids[i]) {
              l.x = bus_centroids[i].x / bus_centroids[i].count;
              l.y = bus_centroids[i].y / bus_centroids[i].count;
            }
          }
          l.nodes.push(n);
        }
        // always count bus size as we also use it to tweak the force graph strengths/distances
        l.size += 1;
        n.bus_data = l;
      });

      for (i in bus_map) { bus_map[i].link_count = 0; }

      // determine links
      data.branches.forEach(e => {
        let u = index(e.source),
            v = index(e.target);
        
        if (u != v) {
          bus_map[u].link_count++;
          bus_map[v].link_count++;
        }

        // u_id and v_id are the node ids in case of original nodes 
        // or cluster ids in case of collapsed nodes
        u_id = !collapse[u] ? e.source.uid : u.toString();
        v_id = !collapse[v] ? e.target.uid : v.toString();

        // define a link id where the smallest index is always first
        let l = lm[e.uid] || (lm[i] = {id: e.uid, source:u_id, target:v_id, size:0});
        l.size += 1;
      });

      for (i in lm) { net_links.push(lm[i]); }

      return {nodes: net_nodes, links: net_links};
    }

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