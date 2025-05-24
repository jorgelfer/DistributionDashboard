import { fetchSchedulingData } from "./https";
import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

export default function ShowScheduling({
  networkModel,
  inFile1,
  enteredCase,
  onDataFetch,
}) {
  let { data, isPending, isError, error } = useQuery({
    queryKey: ["energySchedulingData", networkModel, inFile1],
    queryFn: () => fetchSchedulingData(enteredCase.activeData),
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

    onDataFetch(data);
  }

  return content;
}
