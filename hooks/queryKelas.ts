import { useQuery } from '@tanstack/react-query'
import {
  listAllKelas
} from '@/services/Call'

// LIST ALL KELAS \\
type ListAllKelasResponse = any[]
const fetchListAllKelas =
  async ({
    queryKey,
  }: any): Promise<ListAllKelasResponse> => {
    const hasil: any = await listAllKelas()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListAllKelas() {
  return useQuery<ListAllKelasResponse>({
    queryKey: ['all-kelas'],
    queryFn: fetchListAllKelas,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}