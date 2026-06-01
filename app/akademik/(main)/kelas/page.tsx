import type { Metadata } from "next";
import Kelas from '@/components/ui/Kelas'

export const metadata: Metadata = {
  title: "Data Siswa",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function KelasPage() {
  return <Kelas/>
}