import { useQuery } from '@tanstack/react-query'
import {
  dropDownKelas,
  kelasList
} from '@/services/Call'

// DROPDOWN KELAS \\
type listDropDownKelas = any[]
const fetchListAllKelas =
  async ({
    queryKey,
  }: any): Promise<listDropDownKelas> => {
    const hasil: any = await dropDownKelas()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useDropdownKelas() {
  return useQuery<listDropDownKelas>({
    queryKey: ['all-kelas'],
    queryFn: fetchListAllKelas,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// LIST ALL KELAS \\
type ListAllKelasResponse = {
  [key: string]: any
}
const fetcListTingkatanKelas =
  async ({
    queryKey,
  }: any): Promise<ListAllKelasResponse> => {
    const [_, page, search] = queryKey

    const hasil: any = await kelasList(page, search)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListAllKelas(page: String, search: any) {
  return useQuery<ListAllKelasResponse>({
    queryKey: ['all-kelas', page, search],
    queryFn: fetcListTingkatanKelas,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}