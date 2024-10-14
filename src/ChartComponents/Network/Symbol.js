import * as d3 from 'd3';

import batteryImg from "../../assets/battery.png";
import drImg from "../../assets/demand_response.png";
import evImg from "../../assets/electric_vehicle.png";
import loadImg from "../../assets/load.png";
import pvImg from "../../assets/pv_system.png";
import substationImg from "../../assets/substation.png";

export default function Symbol(selectedValue) {

  switch (selectedValue) {
    case "load":
      return loadImg;
    case "battery":
      return batteryImg;
    case "flex_gen":
      return pvImg;
    case "flex_load":
      return evImg;
    case "dresponse":
      return drImg;
    case "substation":
      return substationImg;
  };

};