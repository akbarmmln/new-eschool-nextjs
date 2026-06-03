import type { Metadata } from "next";
import TambahSiswa from '@/components/ui/TambahSiswa'

export const metadata: Metadata = {
  title: "Input Data Siswa",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function InputSiswaPage() {
  return <TambahSiswa/>
}