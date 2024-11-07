import UnitForm from './UnitForm';
import BatteryForm from './BatteryForm';
import DRloadForm from './DRloadForm';

export default function Form(selectedValue, device, handleSelectDevice, handleChangeDevice) {

  switch (selectedValue) {
    case "battery":
      return <BatteryForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      />;
    case "flex_gen":
      return <UnitForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      />;
    case "flex_load":
      return <UnitForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      />;
    case "dr_load":
      return <DRloadForm 
      selectedValue={selectedValue} 
      device={device}
      onSubmitted={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      />;
    default:
      return null;
  };

};