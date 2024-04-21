import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function useGet<T>(
  url: string,
  initialState: T | null = null,
  mappingDTO: (data: any) => T
) {
  const [data, setData] = useState<T | null>(initialState);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}${url}`);
        const mappedData = mappingDTO(response.data);
        setData(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [url, refreshToggle, mappingDTO]);

  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

  return { data, isLoading, refresh };
}
