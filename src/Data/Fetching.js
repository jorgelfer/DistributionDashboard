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

  let { payload, qkey, fetchFn } = defineFetch(
    enteredCase,
    networkModel,
    inFile1
  );

  let { data, isPending, isError, error } = useQuery({
    queryKey: qkey,
    queryFn: () => fetchFn(payload),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  let content;
  if (isPending) {
    content = <div className="loading">Loading...</div>;
  }

  if (isError) {
    content = (
      <Error
        title={`An error occurred during ${enteredCase.activeLayer} fetching!`}
        message={error.info?.message || "Failed to fetch the data"}
      />
    );
  }

  if (data) {
    content = (
      <Charts
        data={data}
        nodeSize={networkModel.includes("8500Node") ? 3 : 5}
        vm_base={networkModel.includes("8500Node") ? 0.05 : 0.05}
      />
    );
  }

  // onActiveData(data);
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
