import type { Metadata } from "next";
import Profile from '@/components/ui/Profile'

export const metadata: Metadata = {
  title: "Profile Saya",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DashboardPage() {
  return <Profile/>
}