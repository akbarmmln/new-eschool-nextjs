import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  tingkatanKelasList,
  updateTingkatKelas,
  deleteTingkatKelas,
  addTingkatKelas,
  dropDownTingkatKelas
} from '@/services/Call'

// DROPDOWN TINGKAT KELAS \\
type listDropDownTingkatKelas = any[]
const fetchListAllTingkatKelas =
  async ({
    queryKey,
  }: any): Promise<listDropDownTingkatKelas> => {
    const hasil: any = await dropDownTingkatKelas()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useDropdownTingkatKelas(
  options?: Partial<UseQueryOptions<listDropDownTingkatKelas>>
) {
  return useQuery<listDropDownTingkatKelas>({
    queryKey: ['dropdown-tingkat-kelas'],
    queryFn: fetchListAllTingkatKelas,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  })
}

// LIST ALL TINGKAT KELAS \\
type ListAllTingkatKelasResponse = {
  [key: string]: any
}
const fetcListTingkatanKelas =
  async ({
    queryKey,
  }: any): Promise<ListAllTingkatKelasResponse> => {
    const [_, page, search] = queryKey

    const hasil: any = await tingkatanKelasList(page, search)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListAllTingkatKelas(page: String, search: any) {
  return useQuery<ListAllTingkatKelasResponse>({
    queryKey: ['all-tingkat-kelas', page, search],
    queryFn: fetcListTingkatanKelas,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// ADD \\
export const useAdd = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = addTingkatKelas(payload)
      return results;
    },
  });
};

// UPDATE \\
export const useUpdate = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateTingkatKelas(payload)
      return results;
    },
  });
};

// DELETE \\
export const useDelete = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = deleteTingkatKelas(payload)
      return results;
    },
  });
};