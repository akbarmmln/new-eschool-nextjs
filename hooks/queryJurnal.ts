import { useQuery } from '@tanstack/react-query'
import {
  jurnalList
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