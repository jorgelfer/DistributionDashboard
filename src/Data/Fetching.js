import { useState } from 'react';
import Button from "../UI/Button";
import { fetchQstsData } from './https';
import DisplayScheduling from './DisplayScheduling';
import useFetch from './useFetch';
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';


// import ReactPDF from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from '../UI/Report/MyDocument';



export default function Fetching({networkModel, inFile1}) {

  const [isScheduling, setIsScheduling] = useState(false)
  function handleScheduling() {
    setIsScheduling((curIsScheduling) => !curIsScheduling);
  }

  const [schedulingData, setSchedulingData] = useState(null);
  function handleSchedulingData(data) {
    setSchedulingData(data);
  }

  const [isReporting, setIsReporting] = useState(false);
  function handleReport() {
    setIsReporting((curIsReporting) => !curIsReporting);
  }

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const {loading, data, error} = useFetch(fetchQstsData, qstsURL);

  if (error) {
    return <Error title="An error occurred during QSTS fetching!" message={error.message} />;
  }

  return (
    <>
      {!isReporting && !isScheduling && <>
          {loading && <div className="loading">Loading...</div>}
          {!loading && <>
            <Charts data={data} />
          </>}
       </>}
      {!isReporting && isScheduling && schedulingData === null && <>
      <DisplayScheduling 
        payload={data}
        onSchedulingData={handleSchedulingData}
      />
      </>}
      {!isReporting && isScheduling && schedulingData !== null && <>
        <Charts data={schedulingData} />
      </>}
      {isReporting && <div className='report'>
        <PDFViewer>
          <MyDocument />
        </PDFViewer>
      </div>}
      <div className="buttons">
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
      <p className="form-actions">
        <button className="login-button" onClick={() => handleReport()}>Report</button>
      </p>
    </>
  );
};