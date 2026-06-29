import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  jurnalList,
  jurnalListSearch,
  detailJurnal,
  updateAbsensi,
  newjurnal,
  getItemPenilaian,
  submitItemPenilaian,
  editItemPenilaian,
  inisiasiPenilaian,
  updateJurnal,
  submitNilai,
  doDownloadSingleNilaiHarian,
  detailAnakCard,
  listKontribusi,
  getPreviewJurnal
} from '@/services/Call'
import isEmpty from '@/utils/isEmpty'

// LIST JURNAL \\
type jurnalListResponse = {
  [key: string]: any
}
const fetchListJurnal =
  async ({
    queryKey,
  }: any): Promise<jurnalListResponse> => {
    const [_, page, dateDari, dateSampai, keySearch] = queryKey

    let hasil: any;
    if (isEmpty(dateDari) && isEmpty(dateSampai)) {
      hasil = await jurnalList(page)
    } else {
      hasil = await jurnalListSearch(page, dateDari, dateSampai, keySearch)
    }
    
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useJurnal(page: string, dateDari: string, dateSampai: string, keySearch: string) {
  return useQuery<jurnalListResponse>({
    queryKey: ['jurnal-list', page, dateDari, dateSampai, keySearch],
    queryFn: fetchListJurnal,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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

// GET INISIASI PENILAIAN \\
type inisiasiPenilaianResponse = {
  [key: string]: any
}
const fetchInisiasiPenilaian =
  async ({
    queryKey,
  }: any): Promise<inisiasiPenilaianResponse> => {
    const [_, id_jurnal, id_siswa, id_diajar] = queryKey

    const body = {
      id_jurnal,
      id_siswa,
      id_diajar
    }
    const hasil: any = await inisiasiPenilaian(body)
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useInisiasiPenilaian(id_jurnal: string, id_siswa: string, id_diajar: string, options?: Partial<UseQueryOptions<inisiasiPenilaianResponse>>) {
  return useQuery<inisiasiPenilaianResponse>({
    queryKey: ['inisiasi-penilaian', id_jurnal, id_siswa, id_diajar],
    queryFn: fetchInisiasiPenilaian,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    ...options,
  });
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

// SUBMIT NILAI \\
export const useSubmitNilai = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = submitNilai(payload)
      return results;
    },
  });
};

// DOWNLOAD SINGLE NILAI HARIAN \\
export const useDownloadSingleNilaiHarian = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = doDownloadSingleNilaiHarian(payload)
      return results;
    },
  });
};

// RENDER DETAIL CARD ANAK \\
export const useRenderDetailCardAnak = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = detailAnakCard(payload.page, payload.body)
      return results;
    },
  });
}

// LIST KONTRIBUSI \\
type listKontribusiRespinse = any;
const fetchListKontribusi =
  async (): Promise<listKontribusiRespinse> => {
    const hasil: any = await listKontribusi()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useListKontribusi() {
  return useQuery<listKontribusiRespinse>({
    queryKey: ['list-kontribusi'],
    queryFn: fetchListKontribusi,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// PREVIEW JURNAL \\
export const usePreviewJurnal = () => {
  return useMutation({
    mutationFn: async (idDiajar: string) => {
      const results = getPreviewJurnal(idDiajar)
      return results;
    },
  });
}