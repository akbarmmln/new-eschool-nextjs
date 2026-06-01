import type { Metadata } from "next";
import TingkatKelas from '@/components/ui/TingkatKelas'

export const metadata: Metadata = {
  title: "Data Tingkat Kelas",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function TingkatKelasPage() {
  return <TingkatKelas/>
}