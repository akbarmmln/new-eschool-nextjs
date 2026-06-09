import type { Metadata } from "next";
import Dashboard from '@/components/ui/Dashboard'

export const metadata: Metadata = {
  title: "Beranda",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DashboardPage() {
  return <Dashboard/>
}