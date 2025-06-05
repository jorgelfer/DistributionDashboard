import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";
import { defineFetch } from "./defineFetch";

export default function ReShowScheduling({
  networkModel,
  inFile1,
  openDSSData,
  activeLayer,
  enteredConf,
  isConfSubmitted,
}) {
  // // change back to
  // handleSubmitted();

  // energy scheduling call
  openDSSData["kVA_base"] = enteredConf.kVA_base;
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
    enabled: isConfSubmitted,
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
