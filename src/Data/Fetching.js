import { useState } from "react";
import Buttons from "../Interactions/Buttons";

import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

import { fetchOpenDSSData } from "./https";

import { defineFetch } from "./defineFetch";
import ShowScheduling from "./ShowScheduling";

export default function Fetching({
  networkModel,
  inFile1,
  enteredCase,
  onActiveData,
}) {
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

  return (
    <>
      {enteredCase.activeLayer === "opendss_qsts" && content}
      {enteredCase.activeLayer === "energy_scheduling" && (
        <ShowScheduling
          networkModel={networkModel}
          inFile1={inFile1}
          openDSSData={data}
        />
      )}
    </>
  );
}
