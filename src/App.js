import { useState, useEffect } from 'react';
import Charts from './Charts/Charts';
import Error from './UI/Error/Error';
import Login from './UI/Login/Login';
import { actualFetchData } from './https';

export default function App() {
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);
  // const [error, setError] = useState();

  //  useEffect(() => {

  //   const dataURL = "http://127.0.0.1:5000/qsts/123Bus/IEEE123Master.dss";

  //   // function-based JS based fetch
  //   async function fetchData() {

  //     try{

  //       const data = await actualFetchData(dataURL);

  //       setData(data);
  //       setLoading(false);

  //       } catch (error) {
  //         setError({
  //           message: error.message || 'Could not fetch the data. Please try again!'
  //         });
  //       }
  //   }
    
  //   fetchData();
  // }, []); 

  // if (error) {
  //   return <Error title="An error occurred!" message={error.message} />;
  // }

  return (
    <main>
      <Login />
    </main>
    // <div className="container">
    //   {loading && <div className="loading">Loading...</div>}
    //   {!loading && <Charts data={data} />}
    // </div>
  );
};
