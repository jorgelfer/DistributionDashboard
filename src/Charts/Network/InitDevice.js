
export default function InitDevice(selectedValue, bus, T) {

  const ph0 = bus.phases[0];
  let vdict = {};
  switch (selectedValue) {
    case "battery":
      vdict[ph0] = Array(T).fill(0);
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              capacity: 100,
              charging_limit: 20,
              efficiency: 0.9,
              initial_energy: 0.8,
              final_energy: 0.8,
              cost: 0.01,
              revenue: 0.01,
              terminals: bus.phases,
              phases: [bus.phases[0]],
              soc: vdict,
              p_bsc: vdict,
              p_bsd: vdict,
            };
    case "flex_gen":
      vdict[ph0] = Array(T).fill(0);
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [bus.phases[0]],
              cost: 0.01,
              power_rating: 10,
              p: vdict,
            };
    case "flex_load":
      vdict[ph0] = Array(T).fill(0);
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [bus.phases[0]],
              cost: 0.5,
              power_rating: 10,
              p: vdict,
            };
    case "dr_load":
      vdict[ph0] = Array(T).fill(0);
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [bus.phases[0]],
              cost: 0.5,
              response_percent: 1,
              pf: 0.9,
              p: vdict,
            };
    default:
      return null;
  };

};