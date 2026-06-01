import type { Metadata } from "next";
import DetailTingkatKelas from '@/components/ui/DetailTingkatKelas'

export const metadata: Metadata = {
  title: "Detail Tingkat Kelas",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DetailTingkatKelasPage() {
  return <DetailTingkatKelas/>
}