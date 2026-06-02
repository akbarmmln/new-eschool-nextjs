import type { Metadata } from "next";
import Siswa from '@/components/ui/Siswa'

export const metadata: Metadata = {
  title: "Data Siswa",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function SiswaPage() {
  return <Siswa/>
}