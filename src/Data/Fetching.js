
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';
import Button from "../UI/Button";
import { fetchQstsData } from './https';
import useFetch from './useFetch';

export default function Fetching({networkModel, inFile1}) {

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const {loading:loading_qsts, data:data_qsts, error_qsts} = useFetch(fetchQstsData, qstsURL);

  if (error_qsts) {
    return <Error title="An error occurred during QSTS fetching!" message={error_qsts.message} />;
  }

  return (
    <>
      {loading_qsts && <div className="loading">Loading...</div>}
      {!loading_qsts && 
      <>
        <Charts data={data_qsts} />
        <div className="layers">
          <Button
            id="qsts"
            label="QSTS"
            isActive={true}
          />
          <Button
            id="scheduling"
            label="Scheduling"
            isActive={true}
          />
        </div>
      </>}
    </>
  );
};