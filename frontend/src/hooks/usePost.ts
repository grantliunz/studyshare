import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Mapper } from '../mappers/mapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function usePost<T, R>(
  url: string,
  mappingDTO: Mapper<R> = (data: any) => data
) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postData(data: T): Promise<R | null> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}${url}`, data);
      const mappedData = mappingDTO(response.data);
      return mappedData;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'An error occurred');
      } else {
        setError('An error occurred');
      }
      return error;
    } finally {
      setLoading(false);
    }
  }

  return { postData, isLoading, error };
}
