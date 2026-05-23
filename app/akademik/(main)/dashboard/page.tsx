import type { Metadata } from "next";
import DashboardClient from '@/components/ui/DashboardClient'

export const metadata: Metadata = {
  title: "Dashboard",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DashboardPage() {
  return <DashboardClient/>
}