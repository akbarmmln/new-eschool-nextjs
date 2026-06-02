import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  siswaList,
  deleteSiswa
} from '@/services/Call'

// LIST ALL SISWA \\
type ListAllSiswaResponse = {
  [key: string]: any
}
const fetcListSiswa =
  async ({
    queryKey,
  }: any): Promise<ListAllSiswaResponse> => {
    const [_, page, search] = queryKey

    const hasil: any = await siswaList(page, search)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListSiswa(page: String, search: any) {
  return useQuery<ListAllSiswaResponse>({
    queryKey: ['all-siswa', page, search],
    queryFn: fetcListSiswa,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// DELETE \\
export const useDelete = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = deleteSiswa(payload)
      return results;
    },
  });
};