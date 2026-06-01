import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  dropDownGuru
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
