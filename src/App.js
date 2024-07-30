import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Charts from './Charts/Charts';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

   useEffect(() => {

    const dataURL = "http://127.0.0.1:5000/qsts/123Bus/IEEE123Master.dss";

    let mounted = true;

    // D3 based fetch
    // d3.json(dataURL).then(data => {
    //   if (mounted) {
    //     setData(data);
    //     setLoading(false);
    //   }
    // });

    // native JS based fetch
    // fetch(dataURL)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     setData(data);
    //     setLoading(false);
    //   });

    // function-based JS based fetch
    async function fetchData() {
      const response = await fetch(dataURL);
      const data = await response.json();
        setData(data);
        setLoading(false);
    }
    fetchData();
    

    return () => mounted = false;
  }, []); 

  return (
    <div className="container">
      {loading && <div className="loading">Loading...</div>}
      {!loading && <Charts data={data} />}
    </div>
  );
};
