import * as d3 from 'd3';

function SymbolDisplay({id, name, viewBox, path}) {
  return (
    <symbol id={id} name={name} viewBox={viewBox}>
      <path d= {path}/>
    </symbol>
  );
}

export default function Symbol(selectedValue) {

  switch (selectedValue) {
    case "p_d":
      return d3.symbolTriangle;
    case "p_i":
      return d3.symbolCross;
    case "soc":
      return d3.symbolDiamond;
    case "p_g":
      return d3.symbolPlus;
    case "p_dr":
      return d3.symbolAsterisk;
    case "vm":
      return d3.symbolAsterisk;
    case "flow":
      return d3.symbolAsterisk;
  };

};