import { useState } from "react";
import Login from './UI/Login/Login';
import Fetching from './Data/Fetching'

export default function App() {

  const [isCaseSubmitted, setCaseSubmitted] = useState(false);

  function handleSubmitted() {
    setCaseSubmitted((curIsCaseSubmitted) => !curIsCaseSubmitted);
  }

  const [enteredCase, setEnteredCase] = useState({
    networkModel: "13Bus",
    inFile1: "IEEE13Nodeckt.dss",
  });

  const infile1_map = { 
    "3Bus" : "case3_unbalanced.dss",
    "4Bus" : "4Bus-DY-reg.dss",
    "13Bus": "IEEE13Nodeckt.dss",
    "123Bus": "IEEE123Master.dss",
    "secondary": "Master.dss",
    "8500Node": "Master-unbal.dss",
    "8500Node_120": "Master-unbal.dss",
    "8500Node_1ph": "Master.dss",
    "8500Node_441": "Master.dss",
    "8500Node_510": "Master-unbal.dss",
    "center_tapped": "center_tap_xfmr.dss",
    };

  function handleInputChange(identifier, value) {
    setEnteredCase(prevCase => ({
      ...prevCase,
      [identifier]: value
    }))
    // By default inFile1 based on networkModel
    if (identifier === "networkModel") {
      setEnteredCase(prevCase => ({
        ...prevCase,
        inFile1: infile1_map[value],
      }))
    } 
  }

  return (
    <>
      {!isCaseSubmitted && <main>
        <Login
          values={enteredCase}
          onEnteredValues={handleInputChange}
          onSubmitted={handleSubmitted}
        />
      </main>}
      {isCaseSubmitted && <div className="container">
        <Fetching 
          networkModel={enteredCase.networkModel} 
          inFile1={enteredCase.inFile1}
        />
      </div>}
    </>
  );
};
