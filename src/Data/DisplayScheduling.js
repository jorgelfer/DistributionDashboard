import useFetch from './useFetch';
import Charts from '../Charts/Charts';
import Error from '../UI/Error/Error';

export default function DisplayScheduling({fetchFn, message}) {
  const {loading, data, error} = useFetch(fetchFn, message);

  if (error) {
    return <Error title="An error occurred during QSTS fetching!" message={error.message} />;
  }

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      {!loading && <>
        <Charts data={data} />
      </>}
    </>
  ) 
};