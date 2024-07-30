import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Charts from './Charts/Charts';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

   useEffect(() => {
    // let mounted = true;
    const dataURL = "http://127.0.0.1:5000/qsts/123Bus/IEEE123Master.dss";
    fetch(dataURL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data);
        setLoading(false);
      });

  }, []); 

  return (
    <div className="container">
      {loading && <div className="loading">Loading...</div>}
      {!loading && <Charts data={data} />}
    </div>
  );
};
