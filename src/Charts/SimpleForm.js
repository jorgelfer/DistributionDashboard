import classes from './SimpleForm.module.css';

export default function SimpleForm(props) {

  function handleSubmit(event) {
    // event.preventDefault();
    console.log("Form submitted");
    return false;
  }

  return (
    <>
      <form className={classes["simple-form"]} name="login_form" onSubmit={handleSubmit}>
      <h2 className="login-header">CASE DEFINITION</h2>
      <div className="control-row">
        <div className="control no-margin">
        <label htmlFor="text">Network Model</label>
        <input 
        id="network-model" 
        type="text" 
        name="network-model" 
        />
        </div>

        <div className="control no-margin">
        <label htmlFor="text">InFile1</label>
        <input 
        id="infile1" 
        type="text" 
        name="infile1" 
        />
        </div>
      </div>
      <p className="form-actions">
        <button type="reset" className="login-button button-flat">Reset</button>
        <button className="login-button">Run qsts</button>
      </p>
      </form>
    </>
  );
}