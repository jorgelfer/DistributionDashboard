import { fetchOpenDSSData, fetchSchedulingData, fetchFBSData } from "./https";
import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";

export function defineFetch(enteredCase, networkModel, inFile1) {
  let payload, qkey, fetchFn;
  switch (enteredCase.activeLayer) {
    case "opendss_qsts":
      payload = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
      qkey = ["qstsData", networkModel, inFile1];
      fetchFn = fetchOpenDSSData;
      return { payload, qkey, fetchFn };

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
