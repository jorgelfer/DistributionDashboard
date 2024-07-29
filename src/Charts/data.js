import batteryImg from "../assets/battery.png";
import demand_responseImg from "../assets/demand_response.png";
import demandImg from "../assets/demand.png";
import flowsImg from "../assets/flows.png";
import mismatchImg from "../assets/mismatch.png";
import solarImg from "../assets/solar.png";
import voltageImg from "../assets/voltage.png";

export const DATADISPLAY = {
  vm: {
    image: voltageImg,
    title: 'Voltage Magnitude',
  },
  flow:{
    image: flowsImg,
    title: 'Power Flows',
  },
  soc: {
    image: batteryImg,
    title: 'Battery SOC',
  },
  p_d: {
    image: demandImg,
    title: 'Demand',
  },
  p_g: {
    image: solarImg,
    title: 'Generation',
  },
  p_dr: {
    image: demand_responseImg,
    title: 'Demand Response',
  },
  p_i: {
    image: mismatchImg,
    title: 'Power Mismatch',
  },
};
