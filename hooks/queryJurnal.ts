import { useQuery } from '@tanstack/react-query'
import {
  jurnalList,
  detailJurnal
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