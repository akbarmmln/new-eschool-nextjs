"use client";

import DashboardAdmin from '@/components/ui/DashboardAdmin'
import DashboardWalMur from '@/components/ui/DashboardWalMur'
import { useAccessContext } from '@/context/AccessContext'

export default function DashboardClient() {
  const dataAccess = useAccessContext()

  if (dataAccess?.access?.role == '0') {
    return <DashboardAdmin />
  } else if (dataAccess?.access?.role == '1') {
    return <div>sabar belum ada</div>
  } else {
    return <DashboardWalMur />
  }
}