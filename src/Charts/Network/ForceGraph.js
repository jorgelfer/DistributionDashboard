import { useMemo, useState } from "react";
import * as d3 from 'd3';
import Symbol from './Symbol';
import Circle from "../../ChartComponents/Circle";
import Line from "../../ChartComponents/Line";
import InitDevice from './InitDevice';

import { useEffect, useRef } from "react";

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

  // Handler for click events on devices
  function device_click(event) {
    if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
      let device = props.data[`${props.selectedValue}`].find(f => f.bus === event.target.id);
      props.onSelectDevice(device);
    }
  }

  // Handler for click events on devices
  function node_click(event) {
    let d = props.data.bus.find(d => d.uid === event.target.id);
    props.onSelectBus([d]);
  }

  // Handlers for doubleclick events on nodes
  function node_dblclick(event) {
    let d = props.data.bus.find(d => d.uid === event.target.id);
    if (["battery", "dr_load", "flex_gen", "flex_load"].includes(props.selectedValue)) {
      if (props.selectedValue === "dr_load" && !dr_nodes.includes(d.uid)) {
        return;
      }
      // ---------------------------------------
      // check if a device is already connected at this bus
      let device = props.data[`${props.selectedValue}`] && props.data[`${props.selectedValue}`].find(f => f.bus === d.uid) || null;
      console.log(device);
      if (device) {
        // Remove the device from array
        props.onSubmitDevice(device, true);
      } else {
        //
        console.log("should add device");
        // update original data
        props.onSubmitDevice(InitDevice(props.selectedValue, d, props.data.time.length), false);
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

  //////////////////////////////////
  // Brush
  const brushRef = useRef();
  useEffect(() => {
    let nodeBrush = d3.brush()
      .extent([[0, 0], [props.innerWidth, props.innerHeight]])
    nodeBrush(d3.select(brushRef.current));
    nodeBrush
      .on('start', function () {
          props.onSelectBus([]);
      })

    nodeBrush
      .on('brush', function (event) {
        // console.log('event::: ', event);
        // console.log('event.selection::: ', event.selection);
        if (!event.selection) {
          props.onSelectBus([]);
          return;
        }
        let brushedArea = event.selection
        let buses = props.data.bus.filter(d => {
          return isBrushed(brushedArea, props.xScale(d.x), props.yScale(d.y));
        }) 
        props.onSelectBus(buses);
      })
  }, [props]);

  function isBrushed(brush_coords, cx, cy) {
      if (brush_coords) {
          let x0 = brush_coords[0][0],
              x1 = brush_coords[1][0],
              y0 = brush_coords[0][1],
              y1 = brush_coords[1][1];
          return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
      }
  }
  ////////////////////////////////////

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
            className="symbol"
            id={d.uid}
            transform="translate(5,5)"
            display={active_nodes.includes(d.uid) ? "block" : "none"}
            heigth={25}
            width={25}
            href={Symbol(props.selectedValue)}
            onClick={device_click}
            >
          </image>
        </g>
      ))}
      <g className="brush" ref={brushRef} />
    </>
  );
}