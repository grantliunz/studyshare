import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Mapper } from '../mappers/mapper';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function usePut<T, R>(
  url: string,
  mappingDTO: Mapper<R> = (data: any) => data
) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function putData(data: T): Promise<R | null | AxiosError> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${BACKEND_URL}${url}`, data);
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

  return { putData, isLoading, error };
}
