import { fetchSchedulingData, fetchFBSData } from "./https";

export function defineFetch(enteredConf, activeLayer, networkModel, inFile1) {
  let qkey, fetchFn;
  switch (activeLayer) {
    case "fbs_qsts":
      qkey = ["FBS_QSTS", enteredConf, networkModel, inFile1];
      fetchFn = fetchFBSData;
      return { qkey, fetchFn };

    case "energy_scheduling":
      qkey = ["EnergyScheduling", enteredConf, networkModel, inFile1];
      fetchFn = fetchSchedulingData;
      return { qkey, fetchFn };
    default:
      return null;
  }
}
