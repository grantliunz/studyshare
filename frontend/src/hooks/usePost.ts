import { useState } from 'react';
import axios from 'axios';
import { Mapper } from '../mappers/mapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function usePost<T, R>(url: string, mappingDTO: Mapper<R>) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postData(data: T): Promise<R | null> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}${url}`, data);
      const mappedData = mappingDTO(response.data);
      return mappedData;
    } catch (error) {
      console.error('Error posting data:', error);
      setError('Error posting data');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { postData, isLoading, error };
}
