import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";
import { defineFetch } from "./defineFetch";
// import Sidebar from "../UI/Sidebar/Sidebar";
import Collapsible from "../UI/Collapsible/Collapsible";
import EnergyScheduling from "../UI/Configuration/EnergyScheduling";
import { useState } from "react";

export default function ShowScheduling({
  networkModel,
  inFile1,
  openDSSData,
  activeLayer,
}) {
  // handle change in configuration
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

  // energy scheduling call
  openDSSData["kVA_base"] =
    typeof enteredConf.kVA_base === "string"
      ? parseFloat(enteredConf.kVA_base)
      : enteredConf.kVA_base;
  openDSSData["formulation"] = enteredConf.formulation;

  const { qkey, fetchFn } = defineFetch(
    enteredConf,
    activeLayer,
    networkModel,
    inFile1
  );

  let { data, isPending, isError, error } = useQuery({
    queryKey: qkey,
    queryFn: () => fetchFn(openDSSData),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  let content;
  if (isPending) {
    content = <div className="loading">Loading...</div>;
  }

  if (isError) {
    content = (
      <Error
        title="An error occurred during OpenDSS QSTS fetching!"
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
      {content}
      <Collapsible open={false} title="Configuration">
        <EnergyScheduling
          values={enteredConf}
          onEnteredValues={handleInputChange}
        />
      </Collapsible>
    </>
  );
}
