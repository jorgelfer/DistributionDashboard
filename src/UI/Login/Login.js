import { useState } from "react";
import './Login.css';

export default function Login() {

  const [enteredValues, setEnteredValues] = useState({
    networkModel: "123Bus",
    inFile1: "IEEE123Master.dss"
  });

  const networkModelIsInvalid = !["123Bus", "13Bus"].includes(enteredValues.networkModel);

  function handleInputChange(identifier, value) {
    setEnteredValues(prevValues => ({
      ...prevValues,
      [identifier]: value
    }))
  }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log('Submitted!')
    // console.log(enteredValues);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>CASE DEFINITION</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="text">Network Model</label>
          <input 
          id="network-model" 
          type="text" 
          name="network-model" 
          onChange={(event) => handleInputChange("networkModel", event.target.value)}
          value={enteredValues.networkModel}
          />
          <div className="control-error">{networkModelIsInvalid && <p>Please enter a valid network model.</p>}</div>
        </div>

        <div className="control no-margin">
          <label htmlFor="text">InFile1</label>
          <input 
          id="infile1" 
          type="text" 
          name="infile1" 
          onChange={(event) => handleInputChange("inFile1", event.target.value)}
          value={enteredValues.inFile1}
          />
        </div>
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">Reset</button>
        <button className="button">Run qsts</button>
      </p>
    </form>
  );
}
