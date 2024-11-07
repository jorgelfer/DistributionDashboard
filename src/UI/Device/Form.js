import UnitForm from './UnitForm';
import BatteryForm from './BatteryForm';
import DRloadForm from './DRloadForm';

export default function Form(selectedValue, device) {

  switch (selectedValue) {
    case "battery":
      return <BatteryForm selectedValue={selectedValue} device={device}/>;
    case "flex_gen":
      return <UnitForm selectedValue={selectedValue} device={device}/>;
    case "flex_load":
      return <UnitForm selectedValue={selectedValue} device={device}/>;
    case "dr_load":
      return <DRloadForm selectedValue={selectedValue} device={device}/>;
    default:
      return null;
  };

};