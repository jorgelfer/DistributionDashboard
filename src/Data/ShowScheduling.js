import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

import { defineFetch } from "./defineFetch";

export default function ShowScheduling({
  networkModel,
  inFile1,
  openDSSData,
  activeLayer,
}) {
  // add kVA_base and formulation for running the scheduling
  let kVA_base = 100.0;
  let formulation = "FBS";
  let payload = {
    networkModel: networkModel,
    inFile1: inFile1,
    openDSSData: openDSSData,
    kVA_base: kVA_base,
    formulation: formulation,
  };
  const { qkey, fetchFn } = defineFetch(activeLayer, networkModel, inFile1);
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

  return content;
}
