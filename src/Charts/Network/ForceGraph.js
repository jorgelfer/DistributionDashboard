import { useMemo, useState } from "react";
import * as d3 from 'd3';
import Symbol from './Symbol';
import Circle from "../../ChartComponents/Circle";

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

  // console.log(newLinks);
  const LINK_WIDTH = 3;

  const [nodes, setNodes] = useState(initNodes);
  const [links, setLinks] = useState(newLinks);

  return (
    <>
      {links.map((d, i) => (
        <line
          key={d.uid}
          x1={props.xScale(d.source.x)}
          y1={props.yScale(d.source.y)}
          x2={props.xScale(d.target.x)}
          y2={props.yScale(d.target.y)}
          stroke="black"
          strokeWidth={LINK_WIDTH}
        />
      ))}
      {nodes.map((d, i) => (
        <g key={d.uid}>
          <Circle
            key={d.uid}
            cx={props.xScale(d.x)}
            cy={props.yScale(d.y)}
            r={props.originalNodeSize}
            fill={props.colorScale(d.phases.length)}
          />
          <text
            x={props.xScale(d.x)} 
            y={props.yScale(d.y)} 
            dx={props.originalNodeSize + 10} 
            dy={props.originalNodeSize + 10} 
            textAnchor="middle">
            {d.uid}
          </text>
        </g>
      ))}
    </>
  );
}