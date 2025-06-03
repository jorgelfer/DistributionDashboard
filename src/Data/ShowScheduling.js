import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

import { defineFetch } from "./defineFetch";
import Sidebar from "../UI/Sidebar/Sidebar";

export default function ShowScheduling({
  networkModel,
  inFile1,
  openDSSData,
  activeLayer,
}) {
  // energy scheduling data
  openDSSData["kVA_base"] = 100.0;
  openDSSData["formulation"] = "fbs";
  const { qkey, fetchFn } = defineFetch(activeLayer, networkModel, inFile1);
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
      <div className="page">
        <div className="content">{content}</div>
        <Sidebar />
      </div>
    </>
  );
}
