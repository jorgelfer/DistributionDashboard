import classes from './Form.module.css';

export default function UnitForm({selectedValue, device}) {
  return (
    <>
      <form className={classes.simple} name="unit_form">
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
      <label className={classes.label} htmlFor="text">Response Percent [0 - 100%]</label>
      <input 
      className={classes.input}
      id="response_percent" 
      type="number" 
      min="0"
      max="100"
      name="response_percent" 
      onChange={(event) => console.log(event.target.value)}
      value={device.response_percent}
      />
      </div>
      <div className={classes["no-margin"]}>
      <label className={classes.label} htmlFor="text">Cost [$/kWh]</label>
      <input 
      className={classes.input}
      id="cost" 
      type="number" 
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


      </form>
    </>
  );
}