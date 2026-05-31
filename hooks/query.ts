import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import {
  getProfile,
  getMenus,
  getAccess,
  updateIpAndIa
} from '@/services/Call'

// PROFILE \\
type GreetingResponse = {
  [key: string]: any
}
const fetchProfile =
  async (): Promise<GreetingResponse> => {
    const hasil: any = await getProfile()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useProfile() {
  return useQuery<GreetingResponse>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// MENUS \\
interface MenuItem {
  name: string
  icon: string
  href: string
}
const fetchMenus =
  async (): Promise<MenuItem[]> => {
    const hasil: any = await getMenus()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useMenus() {
  return useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: fetchMenus,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// ACCESS \\
type accessResponse = {
  [key: string]: any
}
const fetchAccess =
  async (): Promise<accessResponse> => {
    const token: any = sessionStorage.getItem("access-token");
    const hasil: any = await getAccess(token);
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
export function useAccess(
  options?: any
) {
  return useQuery<accessResponse>({
    queryKey: ['access'],
    queryFn: fetchAccess,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options
  })
}

// UPDATE INFORMASI PRIBADI OR INFORMASI ALAMAT \\
export const useUpdateIpAndIa = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const results = updateIpAndIa(payload)
      return results;
    },
  });
};