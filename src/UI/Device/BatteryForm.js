import classes from './Form.module.css';

export default function BatteryForm({selectedValue, device, onSelected, onEnteredValues, onSubmitted}) {

  function handleSubmit(event) {
    event.preventDefault();
    onSelected(null);
    onSubmitted(device, false);
  }

  return (
    <>
      <form className={classes.simple} onSubmit={handleSubmit}>
        <h2 className={classes["header"]}>{selectedValue}</h2>

        <div className={classes["control"]}>
          <label className={classes.label} htmlFor="text">Bus</label>
          <input 
            className={classes.input}
            id="bus" 
            type="text" 
            name="bus_uid" 
            value={device.bus}
            readOnly={true}
          />
        </div>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">Capacity [kWh]</label>
            <input 
              className={classes.input}
              id="capacity" 
              type="number" 
              name="capacity" 
              onChange={(event) => onEnteredValues("capacity", event.target.value)}
              value={device.capacity}
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">Charging Limit [kWh]</label>
            <input 
            className={classes.input}
            id="charging_limit" 
            type="number" 
            name="charging_limit" 
            onChange={(event) => onEnteredValues("charging_limit", event.target.value)}
            value={device.charging_limit}
            />
          </div>
        </div>

        <hr />

        <div className={classes["control"]}>
          <label className={classes.label} htmlFor="text">Efficiency [0-1]</label>
          <input 
          className={classes.input}
          id="efficiency" 
          type="number" 
          name="efficiency" 
          onChange={(event) => onEnteredValues("efficiency", event.target.value)}
          value={device.efficiency}
          />
        </div>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">Initial Energy [0-1]</label>
            <input 
            className={classes.input}
            id="initial_energy" 
            type="number" 
            name="initial_energy" 
            value={device.initial_energy}
            onChange={(event) => onEnteredValues("initial_energy", event.target.value)}
            />
          </div>

          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">Final Energy [0-1]</label>
            <input 
            className={classes.input}
            id="final_energy" 
            type="number" 
            name="final_energy" 
            value={device.final_energy}
            onChange={(event) => onEnteredValues("final_energy", event.target.value)}
            />
          </div>
        </div>

        <div className={classes["control-row"]}>
          <div className={classes["control"]}>
            <label className={classes.label} htmlFor="text">Cost [$/kWh]</label>
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
            <label className={classes.label} htmlFor="text">Revenue [$/kWh]</label>
            <input 
            className={classes.input}
            id="revenue" 
            type="number" 
            name="revenue" 
            value={device.revenue}
            onChange={(event) => onEnteredValues("revenue", event.target.value)}
            />
          </div>
        </div>

        <fieldset>
          <legend className={classes.label}>Terminals</legend>
          {device.terminals.map((terminal) => 
          <div key={terminal} className={classes.control}>
            <input
              type="checkbox"
              id={`terminal_${terminal}`}
              name="terminals"
            />
            <label className={classes.label} htmlFor={terminal}>{terminal}</label>
          </div>
          )}
        </fieldset>

        <p className={classes["form-actions"]}>
          <button type="reset" className={classes["button button-flat"]}>Remove</button>
          <button className={classes["button"]}>Submit</button>
        </p>

      </form>
    </>
  );
}