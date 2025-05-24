import { fetchSchedulingData, fetchFBSData } from "./https";

export function defineFetch(activeLayer, networkModel, inFile1) {
  let qkey, fetchFn;
  switch (activeLayer) {
    case "fbs_qsts":
      qkey = ["fbsQSTSData", networkModel, inFile1];
      fetchFn = fetchFBSData;
      return { qkey, fetchFn };

    case "energy_scheduling":
      qkey = ["energySchedulingData", networkModel, inFile1];
      fetchFn = fetchSchedulingData;
      return { qkey, fetchFn };
    default:
      return null;
  }
}
