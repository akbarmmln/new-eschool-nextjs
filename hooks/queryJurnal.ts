import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  jurnalList,
  detailJurnal,
  updateAbsensi,
  newjurnal,
  getItemPenilaian,
  submitItemPenilaian,
  editItemPenilaian,
  updateJurnal
} from '@/services/Call'

// LIST JURNAL \\
type jurnalListResponse = {
  [key: string]: any
}
const fetchListJurnal =
  async ({
    queryKey,
  }: any): Promise<jurnalListResponse> => {
    const [_, page] = queryKey

    const hasil: any = await jurnalList(page)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useJurnal(page: string) {
  return useQuery<jurnalListResponse>({
    queryKey: ['jurnal-list', page],
    queryFn: fetchListJurnal,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// DETAIL JURNAL \\
type jurnalDetailResponse = {
  [key: string]: any
}
const fetchJurnalDetail =
  async ({
    queryKey,
  }: any): Promise<jurnalDetailResponse> => {
    const [_, id] = queryKey

    const hasil: any = await detailJurnal(id)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useDetailJurnal(id: string) {
  return useQuery<jurnalDetailResponse>({
    queryKey: ['jurnal-detail', id],
    queryFn: fetchJurnalDetail,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// GET ITEM PENILAIAN \\
type itemPenilaianResponse = {
  [key: string]: any
}
const fetchItemPenilaian =
  async ({
    queryKey,
  }: any): Promise<itemPenilaianResponse> => {
    const [_, id] = queryKey

    const hasil: any = await getItemPenilaian(id)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useGetItemPenilaian(
  id: string,
  options?: Partial<UseQueryOptions<itemPenilaianResponse>>
) {
  return useQuery<itemPenilaianResponse>({
    queryKey: ['item-penilaian', id],
    queryFn: fetchItemPenilaian,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    ...options,
  });
}

// NEW JURNAL \\
export const useNewJurnal = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = newjurnal(payload)
      return results;
    },
  });
};

// UPDATE JURNAL \\
export const useUpdateJurnal = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateJurnal(payload)
      return results;
    },
  });
};

// UPDATE ABSENSI \\
export const useUpdateAbsensi = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateAbsensi(payload)
      return results;
    },
  });
};

// EDIT ITEM PENILAIAN \\
export const useEditItemPenilaian = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = editItemPenilaian(payload)
      return results;
    },
  });
};

// SUBMIT ITEM PENILAIAN \\
export const useSubmitItemPenilaian = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = submitItemPenilaian(payload)
      return results;
    },
  });
};