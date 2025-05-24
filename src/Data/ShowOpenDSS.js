import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { fetchOpenDSSData } from "./https";
import { useQuery } from "@tanstack/react-query";

export default function ShowOpenDSS({ networkModel, inFile1, onDataFetch }) {
  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  let { data, isPending, isError, error } = useQuery({
    queryKey: ["qstsData", networkModel, inFile1],
    queryFn: () => fetchOpenDSSData(qstsURL),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  let content;
  if (isPending) {
    content = <div className="loading">Loading...</div>;
    onDataFetch(null);
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
