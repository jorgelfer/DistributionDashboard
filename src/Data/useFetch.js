import { useState, useEffect } from 'react';

export default function useFetch(fetchFn,request) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      try{
        const data = await fetchFn(request);
        setData(data);
        } catch (error) {
          setError({
            message: error.message || 'Failed to fetch the data. Please try again'
          });
        }
    setLoading(false);
    }
    fetchData();
  }, [fetchFn, request]);

  return { 
    loading, 
    data,
    error  
  };
};