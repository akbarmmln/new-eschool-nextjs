import type { Metadata } from "next";
import DetailTingkatKelasSide from '@/components/ui/DetailTingkatKelas'

export const metadata: Metadata = {
  title: "Detail Tingkat Kelas",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function DetailTingkatKelas() {
  return <DetailTingkatKelasSide/>
}