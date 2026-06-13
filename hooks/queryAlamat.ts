import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  requestWilayahByKodePos
} from '@/services/Call'

// GET WILAYAH BY KODE POS  \\
export const useGetWilayahByKodePos = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = requestWilayahByKodePos(payload)
      return results;
    },
  });
};
