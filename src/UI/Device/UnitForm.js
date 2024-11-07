import classes from './Form.module.css';

export default function UnitForm({selectedValue, device, onSubmitted}) {

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted(false);
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
            <label className={classes.label} htmlFor="text">Power Rating [kW]</label>
            <input 
            className={classes.input}
            id="power_rating" 
            type="number" 
            name="power_rating" 
            onChange={(event) => console.log(event.target.value)}
            value={device.power_rating}
          />
          </div>

          <div className={classes["control"]}>
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