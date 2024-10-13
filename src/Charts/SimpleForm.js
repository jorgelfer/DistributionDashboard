import classes from './SimpleForm.module.css';

export default function SimpleForm({device}) {

  return (
    <>
      <form className={classes["simple-form"]} name="login_form">
      <h2 className="login-header">CASE DEFINITION</h2>
      <div className="control no-margin">
      <label htmlFor="text">Power Rating [kW]</label>
      <input 
      id="power_rating" 
      type="text" 
      name="power_rating" 
      onChange={(event) => console.log(event.target.value)}
      value={device.power_rating}
      />
      </div>
      <div className="control no-margin">
      <label htmlFor="text">Power Cost [$/kWh]</label>
      <input 
      id="power_cost" 
      type="text" 
      name="power_cost" 
      value={device.power_cost}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>
      <div className="control no-margin">
      <label htmlFor="text">Terminals</label>
      <input 
      id="terminals" 
      type="text" 
      name="terminals" 
      value={device.terminals}
      onChange={(event) => console.log(event.target.value)}
      />
      </div>
      </form>
    </>
  );
}