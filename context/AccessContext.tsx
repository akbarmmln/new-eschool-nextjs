'use client'

import { createContext, useContext } from 'react'

type Access = {
  id_account?: string
  role?: string
  tipe_account?: string
  sessionLogin?: string,
  jabatan?: string
}

type AccessContextType = {
  access: Access | null
}

const AccessContext =
  createContext<AccessContextType>({
    access: null,
  })

type Props = {
  children: React.ReactNode
  access: Access | null
}

export function AccessProvider({
  children,
  access,
}: Props) {

  return (
    <AccessContext.Provider
      value={{
        access,
      }} >
      {children}
    </AccessContext.Provider>
  )
}

export function useAccessContext() {
  return useContext(
    AccessContext
  )
}