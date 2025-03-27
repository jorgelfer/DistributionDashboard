import { useState, useRef } from 'react';
import Button from "../UI/Button";
import { fetchQstsData } from './https';
import DisplayScheduling from './DisplayScheduling';
import useFetch from './useFetch';
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

  const printRef = useRef();
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('print.pdf');
  };

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const {loading, data, error} = useFetch(fetchQstsData, qstsURL);
  console.log("data", data);

  if (error) {
    return <Error title="An error occurred during QSTS fetching!" message={error.message} />;
  }

  return (
    <>
      {!isReporting && !isScheduling && <>
          {loading && <div className="loading">Loading...</div>}
          {!loading && <>
            <Charts 
            data={data} 
            printRef={printRef} 
            nodeSize={networkModel.includes("8500Node") ? 2 : 5}
            />
          </>}
       </>}
      {!isReporting && isScheduling && schedulingData === null && <>
      <DisplayScheduling 
        payload={data}
        printRef={printRef} 
        onSchedulingData={handleSchedulingData}
        nodeSize={networkModel.includes("8500Node") ? 2 : 5}
      />
      </>}
      {!isReporting && isScheduling && schedulingData !== null && <>
        <Charts 
          data={schedulingData} 
          printRef={printRef} 
          nodeSize={networkModel.includes("8500Node") ? 2 : 5}
          />
      </>}
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
        <button className="login-button" onClick={handleDownloadPdf}>Report</button>
      </p>
    </>
  );
};