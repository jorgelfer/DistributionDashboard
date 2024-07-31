import { useState } from "react";

import Login from './UI/Login/Login';
import Fetching from './UI/Fetching'

export default function App() {

  const [isCaseSubmitted, setCaseSubmitted] = useState(false);
  const [enteredCase, setEnteredCase] = useState({
    networkModel: "123Bus",
    inFile1: "IEEE123Master.dss"
  });

  return (
    <>
      {!isCaseSubmitted && <main>
        <Login
          values={enteredCase}
          onEnteredValues={setEnteredCase}
          onSubmitted={setCaseSubmitted}
        />
      </main>}
      {isCaseSubmitted && <div className="container">
        <Fetching caseValues={enteredCase}/>
      </div>}
    </>
  );
};
