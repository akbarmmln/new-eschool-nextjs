"use client";

import DashboardAdminAndGuru from '@/components/ui/DashboardAdminAndGuru'
import DashboardWalMur from '@/components/ui/DashboardWalMur'
import { useAccessContext } from '@/context/AccessContext'

export default function Dashboard() {
  const dataAccess = useAccessContext()

  if (dataAccess?.access?.role == '0') {
    return <DashboardAdminAndGuru />
  } else if (dataAccess?.access?.role == '1') {
    return <DashboardAdminAndGuru />
  } else {
    return <DashboardWalMur />
  }
}