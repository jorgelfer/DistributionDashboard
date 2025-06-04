import EnergyScheduling from "../UI/Configuration/EnergyScheduling";
import { useState } from "react";

export default function Configuration({ handleSubmitted }) {
  const [enteredConf, setEnteredConf] = useState({
    formulation: "fbs",
    kVA_base: 100.0,
  });

  function handleInputChange(identifier, value) {
    setEnteredConf((prevCase) => ({
      ...prevCase,
      [identifier]: value,
    }));
  }

  return (
    <EnergyScheduling
      values={enteredConf}
      onEnteredValues={handleInputChange}
      onSubmitted={handleSubmitted}
    />
  );
}
