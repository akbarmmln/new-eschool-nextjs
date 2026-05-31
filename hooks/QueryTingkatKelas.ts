import { useQuery } from '@tanstack/react-query'
import {
  tingkatanKelasList
} from '@/services/Call'

// LIST ALL TINGKAT KELAS \\
type ListAllKelasResponse = {
  [key: string]: any
}
const fetcListTingkatanKelas =
  async ({
    queryKey,
  }: any): Promise<ListAllKelasResponse> => {
    const [_, page, search] = queryKey

    const hasil: any = await tingkatanKelasList(page, search)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListAllTingkatKelas(page: String, search: any) {
  return useQuery<ListAllKelasResponse>({
    queryKey: ['all-tingkat-kelas', page, search],
    queryFn: fetcListTingkatanKelas,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}