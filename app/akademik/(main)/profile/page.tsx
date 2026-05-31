import type { Metadata } from "next";
import ProfileSaya from '@/components/ui/ProfileSaya'

export const metadata: Metadata = {
  title: "Profile Saya",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DashboardPage() {
  return <ProfileSaya/>
}