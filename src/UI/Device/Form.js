import UnitForm from './UnitForm';
import BatteryForm from './BatteryForm';
import DRloadForm from './DRloadForm';

export default function Form(selectedValue, device, handleSelectDevice) {

  switch (selectedValue) {
    case "battery":
      return <BatteryForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      />;
    case "flex_gen":
      return <UnitForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      />;
    case "flex_load":
      return <UnitForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      />;
    case "dr_load":
      return <DRloadForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      />;
    default:
      return null;
  };

};