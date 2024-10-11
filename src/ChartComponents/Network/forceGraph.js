import { useRef, useEffect } from "react";
import { runForceGraph } from "./forceGraphGenerator";
import classes from "./forceGraph.module.css";

export function ForceGraph({ nodeHoverTooltip, ...props }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, nodeHoverTooltip, props);
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return <div ref={containerRef} className={classes.container} />;
}