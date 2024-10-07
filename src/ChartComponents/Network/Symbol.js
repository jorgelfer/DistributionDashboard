import * as d3 from 'd3';

import batteryImg from "../../assets/battery.png";
import demand_responseImg from "../../assets/demand_response.png";
import demandImg from "../../assets/demand.png";
import mismatchImg from "../../assets/mismatch.png";
import solarImg from "../../assets/solar.png";

export default function Symbol(selectedValue) {

  switch (selectedValue) {
    case "p_d":
      return demandImg;
    case "p_i":
      return mismatchImg;
    case "soc":
      return batteryImg;
    case "p_g":
      return solarImg;
    case "p_dr":
      return demand_responseImg;
  };

};