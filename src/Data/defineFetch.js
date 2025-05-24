import { fetchOpenDSSData, fetchSchedulingData, fetchFBSData } from "./https";
import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

export function defineFetch(enteredCase, networkModel, inFile1) {
  let payload, qkey, fetchFn;
  switch (enteredCase.activeLayer) {
    case "opendss_qsts":
      let get_url = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
      let { data, isPending, isError, error } = useQuery({
        queryKey: ["qstsData", networkModel, inFile1],
        queryFn: () => fetchOpenDSSData(get_url),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

      let content = null;
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
      return content;

    case "fbs_qsts":
      payload = enteredCase.activeData;
      qkey = ["fbsQSTSData", networkModel, inFile1];
      fetchFn = fetchFBSData;
      return { payload, qkey, fetchFn };

    case "energy_scheduling":
      payload = enteredCase.activeData;
      qkey = ["energySchedulingData", networkModel, inFile1];
      fetchFn = fetchSchedulingData;
      return { payload, qkey, fetchFn };
    default:
      return null;
  }
}
