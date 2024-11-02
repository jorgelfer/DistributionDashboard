import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function NodeBreaker(props) {

  // --------------------------------------------------------
  // organize bus and branch data into nodes and links
  let data = {nodes: [], links: []};
  props.data.bus.forEach(d => {
    for (let i=0; i<3; ++i) {
      if (i === 0) {
        data.nodes.push({id: `${d.uid}_n${i}`, group: d.uid, x: d.x, y: d.y, x_shift: 0, y_shift: 0, phases: d.phases});
      } 
      else {
        data.nodes.push({id: `${d.uid}_n${i}`, group: d.uid, x: d.x, y: d.y, x_shift: ((-1)**i)*30, y_shift: - 30, phases: d.phases});
        // data.nodes.push({id: `${d.uid}_n${i}`, group: d.uid, x: d.x, y: d.y});
      }
    }
  });

  props.data.branch.forEach(d => {
    data.links.push({source: `${d.source}_n0`, target: `${d.source}_n1`});
    data.links.push({source: `${d.source}_n0`, target: `${d.source}_n2`});
    data.links.push({source: `${d.source}_n2`, target: `${d.target}_n0`});
  });

  // update scales
  props.xScale.domain(d3.extent(data.nodes, d => d.x));
  props.yScale.domain(d3.extent(data.nodes, d => d.y));

  // make source and target into actual references
  // console.log(props.data);
  for (let i=0; i<data.links.length; ++i) {
    let o = data.links[i];
    o.source = data.nodes.find(x => x.id === o.source);
    o.target = data.nodes.find(x => x.id === o.target);
  }

  const networkRef = useRef();
  useEffect(() => {
    const networkContainer = d3.select(networkRef.current);
    
    const curve = d3.line()
        .curve(d3.curveCardinalClosed.tension(.85));

    function getGroup(n) { return n.group; }

    var off = 15,    // cluster hull offset
        collapse = {}, // collapsed clusters
        nm = {},       // node map
        net, 
        simulation,
        prev_pos = [];

    // constructs the network to visualize
    function network(data, prev, index, collapse) {
      collapse = collapse || {};
      let gm = {},    // group map
          lm = {},    // link map
          gn = {},    // previous group nodes
          gc = {},    // previous group centroids
          net_nodes = [], // output nodes
          net_links = []; // output links

      nm = {}    // reset node map
        
      // process previous nodes for reuse or centroid calculation
      if (prev) {
        prev.nodes.forEach(n => {
          let i = index(n), o;
          if (n.size > 0) {
            gn[i] = n;
            n.size = 0;
          } else if (n === 0) {
            o = gc[i] || (gc[i] = {x:0,y:0,count:0});
            o.x += n.x;
            o.y += n.y;
            o.count += 1;
          } else {
            // n.x += n.x_shift;
            // n.y += n.y_shift;
          }
        });
      }

      // determine nodes
      for (let k=0; k<data.nodes.length; ++k) {
        let n = data.nodes[k],
            i = index(n),
            l = gm[i] || (gm[i]=gn[i]) || (gm[i]={id:i.toString(), phases:n.phases, group:i, size:0, x:n.x, y:n.y, nodes:[]});

        if (collapse[i] !== true) {
          // the node should be directly visible
          nm[n.id] = net_nodes.length;
          net_nodes.push(n);
          if (gn[i]) {
            // place new nodes at cluster location (plus jitter)
            n.x = gn[i].x + n.x_shift;
            n.y = gn[i].y + n.y_shift;
          }
        } else {
          // the node is part of a collapsed cluster
          if (l.size === 0) {
            // if new cluster, add to set and position at centroid of leaf nodes
            nm[i] = net_nodes.length;
            net_nodes.push(l);
            if (gc[i]) {
              l.x = gc[i].x / gc[i].count;
              l.y = gc[i].y / gc[i].count;
            }
          }
          l.nodes.push(n);
        }
        // always count group size as we also use it to tweak the force graph strengths/distances
        l.size += 1;
        n.group_data = l;
      }

      for (let i in gm) { gm[i].link_count = 0; }

      // determine links
      for (let k=0; k<data.links.length; ++k) {
        let e = data.links[k],
            u = index(e.source),
            v = index(e.target);
        
        if (u !== v) {
          gm[u].link_count++;
          gm[v].link_count++;
        }

        // u_id and v_id are the node ids in case of original nodes 
        // or cluster ids in case of collapsed nodes
        let u_id = !collapse[u] ? e.source.id : u.toString();
        let v_id = !collapse[v] ? e.target.id : v.toString();

        // nm is the node position in the net_nodes array
        u = nm[u_id]
        v = nm[v_id]

        // define a link id where the smallest index is always first
        let i = (u<v ? u+"|"+v : v+"|"+u),
            l = lm[i] || (lm[i] = {id: i, source:u_id, target:v_id, size:0});
        l.size += 1;
      }
      for (let i in lm) { net_links.push(lm[i]); }

      return {nodes: net_nodes, links: net_links};
    }

    function convexHulls(nodes, index, offset) {

      let hulls = {};

      // create point sets
      for (let k=0; k<nodes.length; ++k) {
        let n = nodes[k];
        if (n.size) continue;
        let i = index(n),
            l = hulls[i] || (hulls[i] = []);
        l.push([props.xScale(n.x)-offset, props.yScale(n.y)-offset]);
        l.push([props.xScale(n.x)-offset, props.yScale(n.y)+offset]);
        l.push([props.xScale(n.x)+offset, props.yScale(n.y)-offset]);
        l.push([props.xScale(n.x)+offset, props.yScale(n.y)+offset]);
      }

      // create convex hulls
      let hullset = [];
      for (let i in hulls) {
        hullset.push({group: i, path: d3.polygonHull(hulls[i])});
      }

      return hullset;
    }

    function drawCluster(d) {
      return curve(d.path); // 0.8
    }

    // --------------------------------------------------------

    let groups = Array.from(new Set(data.nodes.map(d => d.group)));
    // collapse all nodes in the beginning
    groups.forEach(g => {
      collapse[g] = true;
    });

    init();

    networkContainer.attr("opacity", 1e-6)
      .transition()
        .duration(1000)
        .attr("opacity", 1);

    // --------------------------------------------------------
    function init() {
      if (simulation) simulation.stop();

      net = network(data, net, getGroup, collapse);

      let drag = d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);

      var linkEnter = networkContainer
        .selectAll(".link")
        .data(net.links)
        .join("g")
          .attr("class", "link");
      
      linkEnter
        .append("line")
          .attr("class", "highlight")
          .attr("stroke-width", d => d.size + 4 || 4)
          .style("stroke", "#66CCCC")
          .attr("stroke-opacity", 0)
          .on("dblclick", deleteLink)
          .on("mouseover", linkOver)
          .on("mouseout", linkOut);
      
      linkEnter
        .append("line")
          .attr("stroke-width", d => d.size + 2 || 2)
          .attr("stroke", "#364652")
          .style("pointer-events", "none");
      
      var nodeEnter = networkContainer
        .selectAll(".node")
        .data(net.nodes)
        .join("g")
          .attr("class", "node")
          .call(drag) // Call drag object to setup all drag listeners for nodes
      
      nodeEnter
        .append("circle")
          .attr("class", "background")
          .attr("r", d => { 
            d["radius"] = d.size ? d.size + props.originalNodeSize : props.originalNodeSize+1;
            return d.radius + 5; 
          })
          .style("fill", "ligthsteelblue")
          .style("opacity", 0)
          .style("pointer-events", "none");
      
      nodeEnter
        .append("circle")
          .attr("class", "foreground")
          .attr("r", d => d.radius)
          .style("fill", d => props.colorScale(d.phases.length))
          .on("click", node_click)

      // Append icons for each node in the graph
      // console.log(props.selectedValue);
      // var pathEnter = networkContainer 
      // .selectAll('.symbol')
      //     .data(props.data.bus)
      //     .join("path")
      //         .attr("d", d3.symbol()
      //           .size(200)
      //           .type(Symbol(props.selectedValue)))
      //         .attr('class', 'symbol')
      //         .attr("stroke", "black")
      //         .attr("fill", "black")
      //         .style("visibility", "visible")
      //         .lower();

      // Function called after each tick to set the nodes' position
      const updateNetwork = () => {
        linkEnter.selectAll("line")
          .attr("x1", d => props.xScale(d.source.x))
          .attr("y1", d => props.yScale(d.source.y))
          .attr("x2", d => props.xScale(d.target.x))
          .attr("y2", d => props.yScale(d.target.y));

        nodeEnter
          .attr("transform", d => `translate(${props.xScale(d.x)},${props.yScale(d.y)})`);

        if (!hullEnter.empty()) {
          hullEnter
            .data(convexHulls(net.nodes, getGroup, off))
            .attr("d", drawCluster);
        }
      };           

      simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink().id(d => d.id))
        .nodes(net.nodes)
        .on("tick", updateNetwork);

      // simulation links must be set after nodes
      simulation 
        .force("link")
        .links(net.links);

      var hullEnter = networkContainer
        .selectAll(".hull")
        .data(convexHulls(net.nodes, getGroup, off))
        .join("path")
          .attr("class", "hull")
          .attr("d", drawCluster)
          .style("fill", d => props.colorScale(d.group))
          .on("click", (event, d) => {
            collapse[d.group] = true; 
            // remove link and node groups
            d3.selectAll(".node").remove();
            d3.selectAll(".link").remove();
            init();
          })
          .lower();
      
      if (props.activeLayer === 'nodebreaker') {
        simulation.force("link", null);
        simulation.force("charge", null);
      }

      // Handlers for click events on nodes
      function node_click(event, d) {
          delete d.fx;
          delete d.fy;
          // change color of selected node
          // d3.select(this).classed("fixed", false);
          simulation.alpha(1).restart();
          collapse[d.group] = !collapse[d.group];

          d3.selectAll(".node").remove();
          d3.selectAll(".link").remove();
          init();
      }

      // Handlers for drag events on nodes
      // Drag events adjust the [fx,fy] of the nodes to override the simulation
      function dragstarted(event,d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();

        prev_pos = [d.x, d.y];
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event,d) {
        // get the x and y position of the svg
        // const [xs, ys] = d3.pointer(event, d3.select(".network-graph").node());
        const [xs, ys] = d3.pointer(event, d3.select(".network-graph").node());
        d.fx = props.xScale.invert(xs - props.margin.left);
        d.fy = props.yScale.invert(ys - props.margin.top);

        let nodeDom = this;
        let foundOverlap = false
        net.nodes.forEach(function (otherNode) {
          let distance = Math.sqrt(Math.pow(otherNode.x - d.x, 2) + Math.pow(otherNode.y - d.y, 2));
          if (otherNode !== d && distance < 16) {
            foundOverlap = true;
          }
        })
        if (foundOverlap === true) {
          d3.select(nodeDom).select("circle.background")
            .style("opacity", 0.5);
        }
        else {
          d3.select(nodeDom).select("circle.background")
            .style("opacity", 0);
        }
      };

      function dragended(event,d) {

        // d3.select(this).classed("fixed", true);
        d3.select(this).select("circle.background")
          .style("opacity", 0);

        if (!event.active) simulation.alphaTarget(0);

        // Check if the dragged node is close to another node
        // If so, create a link between them
        net.nodes.forEach(function (otherNode) {
          otherNode.fx = null;
          otherNode.fy = null;
          let distance = Math.sqrt(Math.pow(otherNode.x - d.x, 2) + Math.pow(otherNode.y - d.y, 2));
          if (otherNode !== d && distance < 16) {

            // nm is the node position in the net_nodes array
            let u = nm[d.id]
            let v = nm[otherNode.id]

            let i = (u<v ? u+"|"+v : v+"|"+u)
            let newEdge = {uid: i, source: d, target: otherNode, size:0};

            if (net.links.map(d => d.id).indexOf(newEdge.id) === -1) {
              data.links.push(newEdge);
              d3.selectAll(".node").remove();
              d3.selectAll(".link").remove();
              init()
            }
          }
        });

        // Keeping the [fx,fy] at the dragged positioned will pin it
        // Setting to null allows the simulation to change the [fx,fy]
        // d.fx = event.x;
        // d.fy = event.y;

        // set previous position to the current position
        d.x = prev_pos[0];
        d.y = prev_pos[1];
        prev_pos = [];

      };

      // Handlers for link events
      function deleteLink(event, d) {

        // Filter out the link that is being deleted
        data.links = data.links.filter(p => !(p.source.id === d.source.id && p.target.id === d.target.id));
        d3.selectAll(".node").remove();
        d3.selectAll(".link").remove();
        init()

      }

      function linkOver(event, d) {
        d3.select(this).style("stroke-opacity", 0.75);
      }

      function linkOut() {
        d3.selectAll("line.highlight").style("stroke-opacity", 0);
      }








    }





  }, [data, props]);

    return (
      <g 
      ref={networkRef}
      />
    );
};