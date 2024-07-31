
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';
import Button from "../UI/Button";
import { fetchQstsData } from './https';
import useFetch from './useFetch';

export default function Fetching({networkModel, inFile1}) {

  const qstsURL = `http://127.0.0.1:5000/qsts/${networkModel}/${inFile1}`;
  const {loading, data, error} = useFetch(fetchQstsData, qstsURL);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      {!loading && 
      <>
        <Charts data={data} />
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
      </>
      }
    </>
  );
};