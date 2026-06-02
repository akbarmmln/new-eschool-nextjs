import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  dropDownKelas,
  kelasList,
  updateKelas,
  deleteKelas,
  createKelas
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
    queryKey: ['dropdown-kelas'],
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
const fetcListKelas =
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
    queryFn: fetcListKelas,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// ADD \\
export const useCreate = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = createKelas(payload)
      return results;
    },
  });
};

// UPDATE \\
export const useUpdate = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateKelas(payload)
      return results;
    },
  });
};

// DELETE \\
export const useDelete = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = deleteKelas(payload)
      return results;
    },
  });
};