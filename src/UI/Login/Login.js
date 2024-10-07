import './Login.css';

export default function Login({values, onEnteredValues, onSubmitted}) {

  const networkModelIsInvalid = !["123Bus", "13Bus", "4Bus", "3Bus"].includes(values.networkModel);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted();
  }

  return (
    <form name="login_form" onSubmit={handleSubmit}>
      <h2 className="login-header">CASE DEFINITION</h2>
      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="text">Network Model</label>
          <input 
          id="network-model" 
          type="text" 
          name="network-model" 
          onChange={(event) => onEnteredValues("networkModel", event.target.value)}
          value={values.networkModel}
          />
          <div className="control-error">{networkModelIsInvalid && <p>Please enter a valid network model.</p>}</div>
        </div>

        <div className="control no-margin">
          <label htmlFor="text">InFile1</label>
          <input 
          id="infile1" 
          type="text" 
          name="infile1" 
          onChange={(event) => onEnteredValues("inFile1", event.target.value)}
          value={values.inFile1}
          />
        </div>
      </div>

      <p className="form-actions">
        <button type="reset" className="login-button button-flat">Reset</button>
        <button className="login-button">Run qsts</button>
      </p>
    </form>
  );
}
