import type { Metadata } from "next";
import RoleAkses from '@/components/ui/RoleAkses'

export const metadata: Metadata = {
  title: "Role Akses",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function RoleAksesPage() {
  return <RoleAkses/>
}