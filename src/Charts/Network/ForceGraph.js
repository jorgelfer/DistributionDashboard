import { useMemo, useState } from "react";
import * as d3 from 'd3';
import Symbol from './Symbol';
import Circle from "../../ChartComponents/Circle";
import Line from "../../ChartComponents/Line";
import InitDevice from './InitDevice';

import ActionIcons from "../../Interactions/ActionIcons";
import { useEffect, useRef } from "react";

export default function ForceGraph(props) {

  let actions = [
    { value:"cursor" , label:"Cursor"},
    { value:"plus" , label:"Add/Remove"},
    { value:"brush" , label:"Brush"},
  ];

  const [showSymbol, setShowSymbol] = useState(false);

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

  // available actions
  if (["flow"].includes(props.selectedValue)) {
    actions = actions.filter(f => f.value !== "plus");
    actions = actions.filter(f => f.value !== "brush");
  } else if (["vsource", "load", "mismatch"].includes(props.selectedValue)) {
    actions = actions.filter(f => f.value !== "plus");
  } 

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
    console.log(d);
    props.onSelectBus([d]);
  }


  // Handlers for click events on node groups
  function group_click(event) {
    let d = props.data.bus.find(d => d.uid === event.target.id);
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
        setShowSymbol(!showSymbol);
        // Remove from local data
        props.data[`${props.selectedValue}`] = props.data[`${props.selectedValue}`].filter(f => f.bus !== d.uid);
        // Remove device from original data
        props.onSubmitDevice(device, true);
      } else {
        // show the symbol
        setShowSymbol(!showSymbol);
        // Add to local data
        props.data[`${props.selectedValue}`].push(InitDevice(props.selectedValue, d, props.data.time.length));
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
      .on('end', function (event) {
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

        window.onkeydown = function(event) {
          if (event.key === "Delete") {
            // console.log(buses.map(d => d.uid));
            props.onDeleteBuses(buses.map(d => d.uid));
          }
        };
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
        <g 
          key={d.uid} 
          id={d.uid}
          className="node"
          onClick={props.selectedAction === "plus" ? group_click: null}
        >
          <Circle
            class="circle"
            id={d.uid}
            cx={props.xScale(d.x)}
            cy={props.yScale(d.y)}
            r={props.originalNodeSize}
            fill={props.colorScale(d.phases.length)}
            onClick={props.selectedAction === "cursor" ? node_click : null}
          />
          <image
            x={props.xScale(d.x)} 
            y={props.yScale(d.y)} 
            className="symbol"
            id={d.uid}
            transform="translate(5,5)"
            display={(active_nodes.includes(d.uid) || (active_nodes.includes(d.uid) && showSymbol)) ? "block" : "none"}
            heigth={25}
            width={25}
            href={Symbol(props.selectedValue)}
            onClick={device_click}
            >
          </image>
        </g>
      ))}
      {props.selectedAction === "brush" && <g className="brush" ref={brushRef} />}
    </>
  );
}