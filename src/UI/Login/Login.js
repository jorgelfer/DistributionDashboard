import './Login.css';

export default function Login({values, onEnteredValues, onSubmitted}) {

  const networks = [
    { value:"3Bus" , label:"3Bus", inFile1: "3Bus-DY.dss"},
    { value:"4Bus" , label:"4Bus", inFile1: "4Bus-DY.dss"},
    { value:"123Bus" , label:"123Bus", inFile1: "IEEE123Master.dss"},
    { value:"secondary" , label:"secondary", inFile1: "Master.dss"},
    { value:"8500Node" , label:"8500Node", inFile1: "Master-unbal.dss"},
    { value:"8500Node_120" , label:"8500Node_120", inFile1: "Master-unbal_120.dss"},
    { value:"8500Node_1ph" , label:"8500Node_1ph", inFile1: "Master.dss"},
    { value:"center_tapped" , label:"center_tapped", inFile1: "center_tap_xfmr.dss"},
  ];

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted();
  }

  return (
    <form name="login_form" onSubmit={handleSubmit}>
      <h2 className="login-header">CASE DEFINITION</h2>
      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="dropdown">Network Model</label>
          <select 
          id="network-model" 
          value={values.netWorkModel}
          onChange={(event) => onEnteredValues("networkModel", event.target.value)}>
            <option value="13Bus">13 Bus</option>
            {networks.map((network) => (
              <option key={network.value} value={network.value}>{network.label}</option>
            ))}
          </select>
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
