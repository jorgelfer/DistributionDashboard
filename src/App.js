import { useState } from "react";
import Login from "./UI/Login/Login";
import Fetching from "./Data/Fetching";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import ShowOpenDSS from "./Data/ShowOpenDSS";
import ShowScheduling from "./Data/ShowScheduling";
import Buttons from "./Interactions/Buttons";

const infile1_map = {
  "3Bus": "case3_unbalanced.dss",
  "4Bus": "4Bus-DY-reg.dss",
  "13Bus": "IEEE13Nodeckt.dss",
  "123Bus": "IEEE123Master.dss",
  secondary: "Master.dss",
  "8500Node": "Master-unbal.dss",
  "8500Node_120": "Master-unbal.dss",
  "8500Node_1ph": "Master.dss",
  "8500Node_441": "Master.dss",
  "8500Node_510": "Master-unbal.dss",
  center_tapped: "center_tap_xfmr.dss",
};

const solve_layers = [
  { id: "opendss_qsts", label: "OpenDSS QSTS" },
  { id: "fbs_qsts", label: "FBS QSTS" },
  { id: "energy_scheduling", label: "Energy Scheduling" },
];

export default function App() {
  const [isCaseSubmitted, setCaseSubmitted] = useState(false);

  function handleSubmitted() {
    setCaseSubmitted((curIsCaseSubmitted) => !curIsCaseSubmitted);
  }

  const [enteredCase, setEnteredCase] = useState({
    networkModel: "13Bus",
    inFile1: "IEEE13Nodeckt.dss",
  });

  const queryClient = new QueryClient();

  function handleInputChange(identifier, value) {
    setEnteredCase((prevCase) => ({
      ...prevCase,
      [identifier]: value,
    }));
    // By default inFile1 based on networkModel
    if (identifier === "networkModel") {
      setEnteredCase((prevCase) => ({
        ...prevCase,
        inFile1: infile1_map[value],
      }));
    }
  }

  const [enteredSolution, setEnteredSolution] = useState({
    activeLayer: "opendss_qsts",
    activeData: null,
  });

  // handle layer selection
  function layerSelectionHandler(id) {
    if (enteredSolution.activeLayer !== id) {
      setEnteredSolution((prevState) => ({
        ...prevState,
        activeLayer: id,
      }));
    }
  }

  function activeDataHandler(data) {
    setEnteredSolution((prevState) => ({
      ...prevState,
      activeData: data,
    }));
  }

  return (
    <>
      {!isCaseSubmitted && (
        <main>
          <Login
            values={enteredCase}
            onEnteredValues={handleInputChange}
            onSubmitted={handleSubmitted}
          />
        </main>
      )}
      {isCaseSubmitted && (
        <div className="container">
          <QueryClientProvider client={queryClient}>
            <Fetching
              networkModel={enteredCase.networkModel}
              inFile1={enteredCase.inFile1}
              enteredCase={enteredSolution}
              onActiveData={activeDataHandler}
            />
          </QueryClientProvider>
          <Buttons
            buttons={solve_layers}
            activeButton={enteredCase.activeLayer}
            onButtonSelection={layerSelectionHandler}
          />
        </div>
      )}
    </>
  );
}
