import classes from './Form.module.css';

export default function BatteryForm({selectedValue, device, onSubmitted}) {

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted(false);
  }

  return (
    <>
      <form className={classes.simple} onSubmit={handleSubmit}>
      <h2 className={classes["login-header"]}>{selectedValue}</h2>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Bus</label>
      <input 
      className={classes.input}
      id="bus" 
      type="text" 
      name="bus_uid" 
      value={device.bus}
      readOnly={true}
      />
      <label className={classes.label} htmlFor="text">Capacity [kWh]</label>
      <input 
      className={classes.input}
      id="capacity" 
      type="text" 
      name="capacity" 
      onChange={(event) => console.log(event.target.value)}
      value={device.capacity}
      />
      </div>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Charging Limit [kWh]</label>
      <input 
      className={classes.input}
      id="charging_limit" 
      type="text" 
      name="charging_limit" 
      value={device.charging_limit}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Efficiency</label>
      <input 
      className={classes.input}
      id="efficiency" 
      type="text" 
      name="efficiency" 
      value={device.efficiency}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Initial Energy [kWh]</label>
      <input 
      className={classes.input}
      id="initial_energy" 
      type="text" 
      name="initial_energy" 
      value={device.initial_energy}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Cost [$/kWh]</label>
      <input 
      className={classes.input}
      id="cost" 
      type="text" 
      name="cost" 
      value={device.cost}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>

      <fieldset>
        <legend className={classes.label}>Terminals</legend>
        {device.terminals.map((terminal) => 
        <div key={terminal} className={classes.control}>
          <input
            type="checkbox"
            id={`terminal_${terminal}`}
            name="terminals"
            checked={device.phases.includes(terminal)}
            onChange={(event) => console.log(event.target.checked)}
          />
          <label className={classes.label} htmlFor={terminal}>{terminal}</label>
        </div>
        )}
      </fieldset>

      <p className="form-actions">
        <button type="reset" className="login-button button-flat">Remove</button>
        <button className="login-button">Submit</button>
      </p>

      </form>
    </>
  );
}