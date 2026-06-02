import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  dropDownGuru,
  guruList,
  updateGuru,
  createGuru,
  deleteGuru
} from '@/services/Call'

// DROPDOWN GURU \\
type listDropDownGuru = any[]
const fetchListDropdownGuru =
  async ({
    queryKey,
  }: any): Promise<listDropDownGuru> => {
    const [_, keyword] = queryKey

    const hasil: any = await dropDownGuru(keyword)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useDropdownGuru(
  keyword: string,
  options?: Partial<UseQueryOptions<listDropDownGuru>>
) {
  return useQuery<listDropDownGuru>({
    queryKey: ['dropdown-guru', keyword],
    queryFn: fetchListDropdownGuru,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  })
}

// LIST ALL GURU \\
type ListAllGuruResponse = {
  [key: string]: any
}
const fetcListGuru =
  async ({
    queryKey,
  }: any): Promise<ListAllGuruResponse> => {
    const [_, page, search] = queryKey

    const hasil: any = await guruList(page, search)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListGuru(page: String, search: any) {
  return useQuery<ListAllGuruResponse>({
    queryKey: ['all-guru', page, search],
    queryFn: fetcListGuru,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// UPDATE \\
export const useUpdate = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateGuru(payload)
      return results;
    },
  });
};

// ADD \\
export const useCreate = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = createGuru(payload)
      return results;
    },
  });
};

// DELETE \\
export const useDelete = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = deleteGuru(payload)
      return results;
    },
  });
};