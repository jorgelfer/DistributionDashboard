import UnitForm from './UnitForm';
import BatteryForm from './BatteryForm';
import DRloadForm from './DRloadForm';

export default function Form(selectedValue, device, handleSelectDevice, handleChangeDevice, handleSubmitDevice) {

  switch (selectedValue) {
    case "battery":
      return <BatteryForm 
      value={selectedValue} 
      device={device}
      onSelected={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      onSubmitted={handleSubmitDevice}
      />;
    case "flex_gen":
      return <UnitForm 
      value={selectedValue} 
      device={device}
      onSelected={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      onSubmitted={handleSubmitDevice}
      />;
    case "flex_load":
      return <UnitForm 
      value={selectedValue} 
      device={device}
      onSelected={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      onSubmitted={handleSubmitDevice}
      />;
    case "dr_load":
      return <DRloadForm 
      value={selectedValue} 
      device={device}
      onSelected={handleSelectDevice}
      onEnteredValues={handleChangeDevice}
      onSubmitted={handleSubmitDevice}
      />;
    default:
      return null;
  };

};