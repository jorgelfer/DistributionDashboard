import { useState, useEffect } from 'react';

export default function useFetch(fetchFn,url,payload=null) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      try{
        const data = await fetchFn(url, payload);
        setData(data);
        } catch (error) {
          setError({
            message: error.message || 'Failed to fetch the data. Please try again'
          });
        }
    setLoading(false);
    }
    fetchData();
  }, [fetchFn, url, payload]);

  return { 
    loading, 
    data,
    error  
  };
};