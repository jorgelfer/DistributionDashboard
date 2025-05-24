import { useState } from "react";
import Buttons from "../Interactions/Buttons";

import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

// import { fetchOpenDSSData, fetchSchedulingData, fetchFBSData } from "./https";

import { defineFetch } from "./defineFetch";

// const solve_layers = [
//   { id: "opendss_qsts", label: "OpenDSS QSTS" },
//   { id: "fbs_qsts", label: "FBS QSTS" },
//   { id: "energy_scheduling", label: "Energy Scheduling" },
// ];

export default function Fetching({
  networkModel,
  inFile1,
  enteredCase,
  onActiveData,
}) {
  // const [enteredCase, setEnteredCase] = useState({
  //   activeLayer: "opendss_qsts",
  //   activeData: null,
  // });

  // // handle layer selection
  // function layerSelectionHandler(id) {
  //   if (enteredCase.activeLayer !== id) {
  //     setEnteredCase((prevState) => ({
  //       ...prevState,
  //       activeLayer: id,
  //     }));
  //   }
  // }

  // function activeDataHandler(data) {
  //   setEnteredCase((prevState) => ({
  //     ...prevState,
  //     activeData: data,
  //   }));
  // }

  let content = defineFetch(enteredCase, networkModel, inFile1);

  return (
    <>
      {content}
      {/* <Buttons
        buttons={solve_layers}
        activeButton={enteredCase.activeLayer}
        onButtonSelection={layerSelectionHandler}
      /> */}
    </>
  );
}
