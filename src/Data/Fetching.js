import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";
import { fetchOpenDSSData } from "./https";
import ShowScheduling from "./ShowScheduling";

import { useState } from "react";
import Buttons from "../Interactions/Buttons";

const solve_layers = [
  { id: "opendss_qsts", label: "OpenDSS QSTS" },
  { id: "fbs_qsts", label: "FBS QSTS" },
  { id: "energy_scheduling", label: "Energy Scheduling" },
];

export default function Fetching({ networkModel, inFile1 }) {
  // active layer
  const [activeLayer, setActiveLayer] = useState("opendss_qsts");

  // handle layer selection
  function layerSelectionHandler(id) {
    if (activeLayer !== id) {
      setActiveLayer(id);
    }
  }

  let qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  let { data, isPending, isError, error } = useQuery({
    queryKey: ["qstsData", networkModel, inFile1],
    queryFn: () => fetchOpenDSSData(qstsURL),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  let content;
  if (isPending) {
    content = <div className="loading">Loading...</div>;
  }

  if (isError) {
    content = (
      <Error
        title={`An error occurred during ${activeLayer} fetching!`}
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

  return (
    <>
      {activeLayer === "opendss_qsts" ? (
        content
      ) : (
        <ShowScheduling
          networkModel={networkModel}
          inFile1={inFile1}
          openDSSData={data}
          activeLayer={activeLayer}
        />
      )}
      <Buttons
        buttons={solve_layers}
        activeButton={activeLayer}
        onButtonSelection={layerSelectionHandler}
      />
    </>
  );
}
