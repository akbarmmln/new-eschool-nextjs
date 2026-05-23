import { useQuery } from '@tanstack/react-query'
import {
  getProfile,
  getMenus
} from '@/services/Call'

type GreetingResponse = {
  [key: string]: any
}
interface MenuItem {
  name: string
  icon: string
  href: string
}

const fetchProfile =
  async (): Promise<GreetingResponse> => {
    const hasil: any = await getProfile()
    if (!hasil.ok) {
      throw hasil
    }
    return hasil.data.data
  }
const fetchAccess =
  async (): Promise<MenuItem[]> => {
    const hasil: any = await getMenus()
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

export function useAccess() {
  return useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: fetchAccess,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}