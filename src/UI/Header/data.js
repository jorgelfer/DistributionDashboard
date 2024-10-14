import batteryImg from "../../assets/battery.png";
import drImg from "../../assets/demand_response.png";
import evImg from "../../assets/electric_vehicle.png";
import flowImg from "../../assets/flows.png";
import loadImg from "../../assets/load.png";
import mismatchImg from "../../assets/mismatch.png";
import pvImg from "../../assets/pv_system.png";
import substationImg from "../../assets/substation.png";
import vmImg from "../../assets/voltage.png";

export const DATADISPLAY = {
  vm: {
    image: vmImg,
    title: 'Voltage Magnitude',
  },
  flow:{
    image: flowImg,
    title: 'Power Flow',
  },
  vsource: {
    image: substationImg,
    title: 'Substation',
  },
  load: {
    image: loadImg,
    title: 'Load',
  },
  battery: {
    image: batteryImg,
    title: 'Battery',
  },
  dr_load: {
    image: drImg,
    title: 'Demand Response',
  },
  flex_gen: {
    image: pvImg,
    title: 'Flexible Gen',
  },
  flex_load: {
    image: evImg,
    title: 'Flexible Load',
  },
  mismatch: {
    image: mismatchImg,
    title: 'Power Mismatch',
  },
};
