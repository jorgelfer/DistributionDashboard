import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Symbol from './Symbol';
import InitDevice from './InitDevice';
import d3Tip from 'd3-tip'

import { zoom } from "d3-zoom";
import { select } from "d3-selection";

import ActionIcons from "../../Interactions/ActionIcons";

export default function Net(props) {

  let actions = [
    { value:"cursor" , label:"Cursor"},
    { value:"plus" , label:"Add/Remove"},
    { value:"brush" , label:"Brush"},
  ];

  // available actions
  if (["flow", "vsource"].includes(props.selectedValue)) {
    actions = actions.filter(f => f.value !== "plus");
    actions = actions.filter(f => f.value !== "brush");
  } else if (["vm", "load", "mismatch"].includes(props.selectedValue)) {
    actions = actions.filter(f => f.value !== "plus");
  } 

  const networkRef = useRef();
  useEffect(() => {
    // d3.selectAll(".nodes").remove();
    d3.selectAll(".node").remove();
    d3.selectAll(".link").remove();

    const networkContainer = d3.select(networkRef.current);

    //////////////////////////////////
    // tooltip
    let toolTip = d3Tip()
        .attr("class", "d3-tip")
        .offset([-12, 0])
        .html(function (event, d) {
            return "<h5>" + d['uid'] + "</h5>";
        });

    // Call tooltip to initialize it to document and svg
    networkContainer.call(toolTip)

    // active nodes
    var active_nodes = [];
    if (!["vm", "flow", "mismatch"].includes(props.selectedValue)) {
      if (props.data[`${props.selectedValue}`]) {
        active_nodes = props.data[`${props.selectedValue}`].map(d => d.bus);
      }
    } 

    // demand response nodes
    var dr_nodes = [];
    if (props.selectedValue === "dr_load") {
      dr_nodes = props.data["load"].map(d => d.bus);
    }

    // Set the domain of the x and y scales
    props.xScale.domain(d3.extent(props.data.bus, d => d.x));
    props.yScale.domain(d3.extent(props.data.bus, d => d.y));

    // Append weighted lines for each link in network
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

    let nodeEnter = networkContainer
      .append("g")
      .attr("class", "nodes");
    
    let myNodes = nodeEnter
      .selectAll(".node")
      .data(props.data.bus)
      .join("g")
        .attr("class", "node")
        .on("click", props.selectedAction === "plus"? group_click : null)
        .on('mouseover', toolTip.show) // Add mouse hover tooltip listeners
        .on('mouseout', toolTip.hide)
        .call(drag); // Call drag object to setup all drag listeners for nodes

    // Append circles for each node in the graph
    myNodes
      .append('circle')
        .attr('class', 'circle')
        .on("click", props.selectedAction === "cursor"? node_click : null)
        .attr("r", props.originalNodeSize)
        .style('fill', d => {
          // console.log(d.phases.length);
          if (props.selectedValue === "dr_load") {
            return (dr_nodes.includes(d.uid) ? props.colorScale(d.phases.length) : "grey");
          } else {
            return props.colorScale(d.phases.length);
          }
          });

    myNodes
    .append("image")
      .attr("class", "symbol")
      .attr("xlink:href", Symbol(props.selectedValue))
      .attr("transform", "translate(5,5)")
      .attr("width", 25)
      .attr("height", 25)
      .style("display", d => active_nodes.includes(d.uid) ? "block" : "none")
      .on("click", device_click);

    function tickSimulation() {
      linkEnter
        .attr('x1', d => props.xScale(d.source.x))
        .attr('y1', d => props.yScale(d.source.y))
        .attr('x2', d => props.xScale(d.target.x))
        .attr('y2', d => props.yScale(d.target.y));

      myNodes
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

    // Handler for click events on devices
    function device_click(event, d) {
      if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
        let device = props.data[`${props.selectedValue}`].find(f => f.bus === d.uid);
        props.onSelectDevice(device);
      }
    }

    // Handlers for click events on nodes
    function node_click(event, d) {
      props.onSelectBus([d]);
    }

    // Handlers for click events on node groups
    function group_click(event, d) {
      if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
        if (props.selectedValue === "dr_load" && !dr_nodes.includes(d.uid)) {
          return;
        }
        // ---------------------------------------
        // check if a device exist in local data 
        // create the new device
        props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`] || [];
        let device = props.data[`${props.selectedValue}`].find(f => f.bus === d.uid) || null;
        if (device) {
          // hide the symbol
          d3.select(this).select("image.symbol")
            .style("display", "none");
          // Remove from local data
          props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`].filter(f => f.bus !== d.uid);
          // Remove from original data
          props.onSubmitDevice(device, true);
        } else {
          // show the symbol
          d3.select(this).select("image.symbol")
            .style("display", "block");
          // Add to local data
          props.data[`${props.selectedValue}`].push(InitDevice(props.selectedValue, d, props.data.time.length));
          // Add to original data
          props.onSubmitDevice(InitDevice(props.selectedValue, d, props.data.time.length),false);
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

    //////////////////////////////////
    // Brush
    let nodeBrush = d3.brush().extent([[0, 0], [props.innerWidth, props.innerHeight]])
        .on('end', function (event) {
            // console.log('event::: ', event);
            // console.log('event.selection::: ', event.selection);
            let brushedArea = event.selection
            let buses = props.data.bus.filter(d => {
              return isBrushed(brushedArea, props.xScale(d.x), props.yScale(d.y));
            }) 
            props.onSelectBus(buses);
        })

    function isBrushed(brush_coords, cx, cy) {
        if (brush_coords) {
            let x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }
    }
    if (props.selectedAction === "brush") {
      nodeEnter.call(nodeBrush) // calling a d3 brush
    }


    //////////////////////////////////
    // Handle zoom
    const zoomHandler = zoom()
      .on("zoom", (e) => {
        networkContainer.attr("transform", e.transform);
    });

    select(".network-graph")
      .call(zoomHandler)
      .on("dblclick.zoom", null);


  }, [props]);

    return (
      <>
        {actions.map((action, i) => (
          <image
            key={action.value}
            x={-props.margin.left} 
            y={10 + i * 35} 
            className="interaction"
            opacity={props.selectedAction === action.value ? 1 : 0.6}
            heigth={25}
            width={25}
            href={ActionIcons(action.value)}
            onClick={() => props.onSelectedAction(action.value)}
            >
          </image>
        ))}
        <g 
        ref={networkRef}
        />
      </>
    );
};