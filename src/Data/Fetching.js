import { useState } from 'react';
import Button from "../UI/Button";
import { fetchQstsData } from './https';
import DisplayScheduling from './DisplayScheduling';
import useFetch from './useFetch';
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';

export default function Fetching({networkModel, inFile1}) {

  const [isScheduling, setIsScheduling] = useState(false)
  function handleScheduling() {
    setIsScheduling((curIsScheduling) => !curIsScheduling);
  }

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const {loading, data, error} = useFetch(fetchQstsData, qstsURL);

  if (error) {
    return <Error title="An error occurred during QSTS fetching!" message={error.message} />;
  }

  return (
    <>
      {!isScheduling && <>
          {loading && <div className="loading">Loading...</div>}
          {!loading && <>
            <Charts data={data} />
          </>}
       </>}
      {isScheduling && <>
      <DisplayScheduling payload={data} />
      </>}
      <div className="layers">
        <Button
          id="qsts"
          label="QSTS"
          isActive={!isScheduling}
          onClick={handleScheduling}
        />
        <Button
          id="scheduling"
          label="Scheduling"
          isActive={isScheduling}
          onClick={handleScheduling}
        />
      </div>
    </>
  );
};