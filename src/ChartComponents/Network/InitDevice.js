
export default function InitDevice(selectedValue, bus, T) {

  const ph0 = bus.phases[0];

  switch (selectedValue) {
    case "battery":
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
              phases: [ph0],
              soc: {ph0: Array(T).fill(0)},
            };
    case "flex_gen":
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [ph0],
              cost: 0.1,
              power_rating: 10,
              p: {ph0: Array(T).fill(0)},
            };
    case "flex_load":
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [ph0],
              cost: 0.5,
              power_rating: 10,
              p: {ph0: Array(T).fill(0)},
            };
    case "dr_load":
      return {
              uid: `${selectedValue}_${bus.uid}`,
              bus: bus.uid,
              terminals: bus.phases,
              phases: [ph0],
              cost: 0.5,
              power_rating: 10,
              p: {ph0: Array(T).fill(0)},
              power_factor: 0.9,
            };
    default:
      return null;
  };

};