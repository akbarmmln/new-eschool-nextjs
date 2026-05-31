"use client";

import ProfileSayaDS1 from '@/components/ui/ProfileSayaDS1'
import ProfileSayaDS2 from '@/components/ui/ProfileSayaDS2'
import { useAccessContext } from '@/context/AccessContext'

export default function Profile() {
  const dataAccess = useAccessContext()

  if (dataAccess?.access?.tipe_account == 'DS1') {
    return <ProfileSayaDS1 />
  } else {
    return <ProfileSayaDS2 />
  }
}