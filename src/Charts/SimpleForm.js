import classes from './SimpleForm.module.css';

export default function SimpleForm({device, onEnteredValues, onSubmitted}) {

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted();
    console.log("Form submitted");
    return false;
  }

  return (
    <>
      <form className={classes["simple-form"]} name="login_form" onSubmit={handleSubmit}>
      <h2 className="login-header">CASE DEFINITION</h2>
      <div className="control no-margin">
      <label htmlFor="text">Power Rating [kW]</label>
      <input 
      id="power-rating" 
      type="text" 
      name="power-rating" 
      onChange={(event) => onEnteredValues("power_rating", event.target.value)}
      value={device.power_rating}
      />
      </div>
      <div className="control no-margin">
      <label htmlFor="text">Power Cost [$/kWh]</label>
      <input 
      id="power-cost" 
      type="text" 
      name="power-cost" 
      onChange={(event) => onEnteredValues("power_cost", event.target.value)}
      value={device.power_cost}
      />
      </div>
      <div className="control no-margin">
      <label htmlFor="text">Terminals</label>
      <input 
      id="terminals" 
      type="text" 
      name="terminals" 
      onChange={(event) => onEnteredValues("terminals", event.target.value)}
      value={device.terminals}
      />
      </div>
      <p className="form-actions">
        <button type="reset" className="login-button button-flat">Reset</button>
        <button className="login-button">Run qsts</button>
      </p>
      </form>
    </>
  );
}