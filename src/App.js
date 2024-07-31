import { useState } from "react";

import Login from './UI/Login/Login';
import Fetching from './Data/Fetching'

export default function App() {

  const [isCaseSubmitted, setCaseSubmitted] = useState(false);

  function handleSubmitted() {
    setCaseSubmitted((curIsCaseSubmitted) => !curIsCaseSubmitted);
  }

  const [enteredCase, setEnteredCase] = useState({
    networkModel: "123Bus",
    inFile1: "IEEE123Master.dss"
  });

  function handleInputChange(identifier, value) {
    setEnteredCase(prevCase => ({
      ...prevCase,
      [identifier]: value
    }))
  }

  return (
    <>
      {!isCaseSubmitted && <main>
        <Login
          values={enteredCase}
          onEnteredValues={handleInputChange}
          onSubmitted={handleSubmitted}
        />
      </main>}
      {isCaseSubmitted && <div className="container">
        <Fetching 
          networkModel={enteredCase.networkModel} 
          inFile1={enteredCase.inFile1}
        />
      </div>}
    </>
  );
};
