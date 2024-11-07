import { useMemo, useState } from "react";
import * as d3 from 'd3';
import Symbol from './Symbol';
import Circle from "../../ChartComponents/Circle";
import Line from "../../ChartComponents/Line";
import InitDevice from './InitDevice';

export default function ForceGraph(props) {

  const initNodes = props.data.bus.map((d) => {
    return {
      ...d,
    };
  });
  const initLinks = props.data.branch.map((d) => {
    return {
      ...d,
    };
  });

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

  function node_click(event) {
    let d = props.data.bus.find(d => d.uid === event.target.id);
    props.onSelectBus(d);
  }

  // Handlers for click events on nodes
  function node_dblclick(event) {
    console.log(props.data[`${props.selectedValue}`]);
    let d = props.data.bus.find(d => d.uid === event.target.id);
    if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
      if (props.selectedValue === "dr_load" && !dr_nodes.includes(d.uid)) {
        return;
      }
      // event.target.fixed = true;
      // console.log(event.target.fixed);
      // d3.select(`#${event.target.id}`).classed("fixed", true);
      // ---------------------------------------
      if (event.target.fixed) {
        // remove the fixed class
        // d3.select(this).classed("fixed", false);
        event.target.fixed = false;
        // // hide the symbol
        // d3.select(this).select("image.symbol")
        //   .style("display", "none");
        // remove the tooltip
        // removeTooltip();
        // Remove the device from array
        // props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`].filter(f => f.bus !== d.uid);
        // update original data
        // props.updateData(props.data);
      } else {
        // add the fixed class
        // d3.select(this).classed("fixed", true);
        event.target.fixed = true;

        // show the symbol
        d3.select(this).select("image.symbol")
          .style("display", "block");
        // create the new device
        props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`] || [];
        // check if the device already exists
        let device = props.data[`${props.selectedValue}`].find(f => f.bus === d.uid);
        console.log(device);
        if (device === undefined) {
          // append new device to the flex_devices array
          props.data[`${props.selectedValue}`].push(InitDevice(props.selectedValue, d, props.data.time.length));
        };
        // update original data
        // props.updateData(props.data);
      };
      // ---------------------------------------
    };
  };

  // Set the domain of the x and y scales
  props.xScale.domain(d3.extent(initNodes, d => d.x));
  props.yScale.domain(d3.extent(initNodes, d => d.y));

  const getUid = (d) => d.uid;

  function d3Map(data, keyAccessor, valueAccessor) {
    const map = new Map();
    data.forEach((d) => {
      map.set(keyAccessor(d), valueAccessor(d));
    });
    return map;
  }

  const newLinks = useMemo(() => {
    const sources = initLinks.map((d) => d.source);
    const targets = initLinks.map((d) => d.target);
    const nodesMap = d3Map(initNodes, getUid, (d) => d);
    const newLinks = initLinks.map((d, i) => {
      return {
        ...d,
        source: nodesMap.get(sources[i]),
        target: nodesMap.get(targets[i]),
      };
    });
    return newLinks;
  }, [initNodes, initLinks]);

  const [nodes, setNodes] = useState(initNodes);
  const [links, setLinks] = useState(newLinks);

  return (
    <>
      {links.map((d, i) => (
        <Line
          key={d.uid}
          class="link"
          x1={props.xScale(d.source.x)}
          y1={props.yScale(d.source.y)}
          x2={props.xScale(d.target.x)}
          y2={props.yScale(d.target.y)}
          stroke="grey"
          strokeWidth={props.linkScale(d.f_connections.length)}
        />
      ))}
      {nodes.map((d, i) => (
        <g key={d.uid} className="node">
          <Circle
            class="circle"
            id={d.uid}
            cx={props.xScale(d.x)}
            cy={props.yScale(d.y)}
            r={props.originalNodeSize}
            fill={props.colorScale(d.phases.length)}
            onClick={node_click}
            onDoubleClick={node_dblclick}
          />
          <image
            x={props.xScale(d.x)} 
            y={props.yScale(d.y)} 
            transform="translate(5,5)"
            display={active_nodes.includes(d.uid) ? "block" : "none"}
            heigth={25}
            width={25}
            href={Symbol(props.selectedValue)}
            >
          </image>
        </g>
      ))}
    </>
  );
}