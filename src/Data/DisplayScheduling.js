import useFetch from './useFetch';
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';
import { fetchSchedulingData } from './https';

export default function DisplayScheduling({payload, printRef, onSchedulingData, nodeSize}) {
  console.log("payload", payload);
  const {loading, data, error} = useFetch(fetchSchedulingData, payload);
  console.log("data", data);

  if (error) {
    return <Error title="An error occurred during Scheduling fetching!" message={error.message} />;
  }

  onSchedulingData(data);

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      {!loading && <>
        <Charts 
          data={data} 
          printRef={printRef} 
          nodeSize={nodeSize}
        />
      </>}
    </>
  ) 
};