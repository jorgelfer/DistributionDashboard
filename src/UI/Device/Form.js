import UnitForm from './UnitForm';
import BatteryForm from './BatteryForm';
import DRloadForm from './DRloadForm';

export default function Form(selectedValue, bus) {

  switch (selectedValue) {
    case "battery":
      return <BatteryForm selectedValue={selectedValue}/>;
    case "flex_gen":
      return <UnitForm selectedValue={selectedValue} />;
    case "flex_load":
      return <UnitForm selectedValue={selectedValue} />;
    case "dr_load":
      return <DRloadForm selectedValue={selectedValue} />;
    default:
      return null;
  };

};