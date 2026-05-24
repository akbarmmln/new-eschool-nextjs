"use client";

import DashboardClientAdmin from '@/components/ui/DashboardClientAdmin'
import { useAccessContext } from '@/context/AccessContext'

export default function DashboardClient() {
  const dataAccess = useAccessContext()
  console.log('DashboardClient-sadsadasasd', dataAccess?.access?.role)

  if (dataAccess?.access?.role == '0') {
    return <DashboardClientAdmin />
  } else if (dataAccess?.access?.role == '1') {
    return <div>sabar belum ada</div>
  } else {
    return <div>sabar ini juga belum ada</div>
  }
}