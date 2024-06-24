import { useState, useEffect } from 'react';
import logo from './logo.svg';
import * as d3 from 'd3';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

   useEffect(() => {
    const dataURL = "https://github.com/jorgelfer/IEEETestCases/blob/main/case3/qsts.json";
    
    let mounted = true;
    d3.json(dataURL).then(data => {
      console.log("data", data);

      if (mounted) {
        setData(data);
        setLoading(false);
      }
    });

    return () => mounted = false;
  }, []); 

  return (
    <div className="container">
      {loading && <div className="loading">Loading...</div>}
      {/* {!loading && <Charts data={data} />} */}
    </div>
  );
}

export default App;
