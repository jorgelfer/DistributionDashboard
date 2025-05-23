import { useState, useRef } from "react";
import Button from "../UI/Button";
import { fetchQstsData } from "./https";
import DisplayScheduling from "./DisplayScheduling";
import useFetch from "./useFetch";
import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import Buttons from "../Interactions/Buttons";

const solve_layers = [
  { id: "opendss_qsts", label: "OpenDSS QSTS" },
  { id: "fbs_qsts", label: "FBS QSTS" },
  { id: "energy_scheduling", label: "Energy Scheduling" },
];

export default function Fetching({ networkModel, inFile1 }) {
  const [enteredCase, setEnteredCase] = useState({
    activeLayer: "opendss_qsts",
    activeData: null,
  });

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const { loading, data, error } = useFetch(fetchQstsData, qstsURL);
  console.log("data", data);

  if (error) {
    return (
      <Error
        title="An error occurred during QSTS fetching!"
        message={error.message}
      />
    );
  }

  return (
    <>
      {!isReporting && !isScheduling && (
        <>
          {loading && <div className="loading">Loading...</div>}
          {!loading && (
            <>
              <Charts
                data={data}
                printRef={printRef}
                nodeSize={networkModel.includes("8500Node") ? 3 : 5}
                vm_base={networkModel.includes("8500Node") ? 0.05 : 0.05}
              />
            </>
          )}
        </>
      )}
      {!isReporting && isScheduling && schedulingData === null && (
        <>
          <DisplayScheduling
            payload={data}
            printRef={printRef}
            onSchedulingData={handleSchedulingData}
            nodeSize={networkModel.includes("8500Node") ? 2 : 5}
            vm_base={networkModel.includes("8500Node") ? 0.07 : 0.05}
          />
        </>
      )}
      {!isReporting && isScheduling && schedulingData !== null && (
        <>
          <Charts
            data={schedulingData}
            printRef={printRef}
            nodeSize={networkModel.includes("8500Node") ? 2 : 5}
            vm_base={networkModel.includes("8500Node") ? 0.07 : 0.05}
          />
        </>
      )}
      <Buttons
        buttons={solve_layers}
        activeButton={activeLayer}
        onButtonSelection={layerSelectionHandler}
      />
    </>
  );
}
