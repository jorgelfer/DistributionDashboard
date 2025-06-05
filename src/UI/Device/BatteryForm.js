import classes from "./Form.module.css";

export default function BatteryForm({
  selectedValue,
  device,
  onSelected,
  onEnteredValues,
  onSubmitted,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSelected(null);
    onSubmitted(device, false);
  }

  return (
    <>
      <form className={classes.simple} onSubmit={handleSubmit}>
        <h2 className={classes["header"]}>{selectedValue}</h2>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Bus
            </label>
            <input
              className={classes.input}
              id="bus"
              type="text"
              name="bus_uid"
              value={device.bus}
              readOnly={true}
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Capacity [kWh]
            </label>
            <input
              className={classes.input}
              id="capacity"
              type="number"
              name="capacity"
              onChange={(event) =>
                onEnteredValues("capacity", event.target.value)
              }
              value={device.capacity}
            />
          </div>
        </div>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Charging Limit [kWh]
            </label>
            <input
              className={classes.input}
              id="charging_limit"
              type="number"
              name="charging_limit"
              onChange={(event) =>
                onEnteredValues("charging_limit", event.target.value)
              }
              value={device.charging_limit}
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Charging Efficiency [0-1]
            </label>
            <input
              className={classes.input}
              id="efficiency"
              type="number"
              name="efficiency"
              onChange={(event) =>
                onEnteredValues("efficiency", event.target.value)
              }
              value={device.efficiency}
            />
          </div>
        </div>

        <hr />
        <h3 className={classes["header"]}>
          Boundary conditions as a factor of capacity
        </h3>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Initial Energy [0-1]
            </label>
            <input
              className={classes.input}
              id="initial_energy"
              type="number"
              name="initial_energy"
              value={device.initial_energy}
              onChange={(event) =>
                onEnteredValues("initial_energy", event.target.value)
              }
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Final Energy [0-1]
            </label>
            <input
              className={classes.input}
              id="final_energy"
              type="number"
              name="final_energy"
              value={device.final_energy}
              onChange={(event) =>
                onEnteredValues("final_energy", event.target.value)
              }
            />
          </div>
        </div>

        <hr />
        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Cost [$/kWh]
            </label>
            <input
              className={classes.input}
              id="cost"
              type="number"
              name="cost"
              value={device.cost}
              onChange={(event) => onEnteredValues("cost", event.target.value)}
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">
              Revenue [$/kWh]
            </label>
            <input
              className={classes.input}
              id="revenue"
              type="number"
              name="revenue"
              value={device.revenue}
              onChange={(event) =>
                onEnteredValues("revenue", event.target.value)
              }
            />
          </div>
        </div>

        <fieldset>
          <legend className={classes.label}>Terminals</legend>
          {device.terminals.map((terminal) => (
            <div key={terminal} className={classes.control}>
              <input
                type="checkbox"
                id={`terminal_${terminal}`}
                name="terminals"
                checked={device.phases.includes(terminal)}
                onChange={(event) => {
                  if (device.phases.includes(terminal)) {
                    onEnteredValues(
                      "phases",
                      device.phases.filter((f) => f !== terminal)
                    );
                    onEnteredValues(
                      "soc",
                      Object.fromEntries(
                        Object.entries(device.soc).filter(
                          ([key, value]) => key !== terminal.toString()
                        )
                      )
                    );
                    onEnteredValues(
                      "p_bsc",
                      Object.fromEntries(
                        Object.entries(device.p_bsc).filter(
                          ([key, value]) => key !== terminal.toString()
                        )
                      )
                    );
                    onEnteredValues(
                      "p_bsd",
                      Object.fromEntries(
                        Object.entries(device.p_bsd).filter(
                          ([key, value]) => key !== terminal.toString()
                        )
                      )
                    );
                  } else {
                    onEnteredValues("phases", [...device.phases, terminal]);
                    onEnteredValues("soc", {
                      ...device.soc,
                      [terminal.toString()]: Array(24).fill(0),
                    });
                    onEnteredValues("p_bsc", {
                      ...device.p_bsc,
                      [terminal.toString()]: Array(24).fill(0),
                    });
                    onEnteredValues("p_bsd", {
                      ...device.p_bsd,
                      [terminal.toString()]: Array(24).fill(0),
                    });
                  }
                }}
              />
              <label className={classes.label} htmlFor={terminal}>
                {terminal}
              </label>
            </div>
          ))}
        </fieldset>

        <p className={classes["form-actions"]}>
          <button className={classes["button"]}>Submit</button>
        </p>
      </form>
    </>
  );
}
