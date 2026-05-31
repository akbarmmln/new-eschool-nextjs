import type { Metadata } from "next";
import TingkatKelasSide from '@/components/ui/TingkatKelas'

export const metadata: Metadata = {
  title: "Tingkat Kelas",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function TingkatKelas() {
  return <TingkatKelasSide/>
}