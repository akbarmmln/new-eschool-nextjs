'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react'

import {
  usePathname,
} from 'next/navigation'

const queryClient = new QueryClient()

/* =========================
   ROUTE CONTEXT
========================= */

const RouteContext = createContext('/');

export const usePreviousRoute = () => useContext(RouteContext)

function RouteProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname();
  const previousPath = useRef('/');
  const currentPath = useRef(pathname);

  useEffect(() => {
    previousPath.current = currentPath.current;
    currentPath.current = pathname;

    console.log('previousPath', previousPath.current)
    console.log('currentPath', currentPath.current)
  }, [pathname])

  return (
    <RouteContext.Provider value={previousPath.current} >
      {children}
    </RouteContext.Provider>
  )
}

/* =========================
   PROVIDERS
========================= */

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient} >
      <RouteProvider>
        {children}
      </RouteProvider>
    </QueryClientProvider>
  )
}