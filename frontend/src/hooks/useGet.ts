import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Mapper } from '../mappers/mapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function useGet<T>(
  url: string,
  initialState: T | null = null,
  mappingDTO: Mapper<T>
) {
  const [data, setData] = useState<T | null>(initialState);
  const [isLoading, setLoading] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}${url}`);
        const mappedData = mappingDTO(response.data);
        setData(mappedData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'An error occurred');
      }
      setLoading(false);
    }
    fetchData();
  }, [url, refreshToggle, mappingDTO]);

  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

  return { data, isLoading, refresh, error };
}
