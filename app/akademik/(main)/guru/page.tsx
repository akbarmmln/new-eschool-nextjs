import type { Metadata } from "next";
import Guru from '@/components/ui/Guru'

export const metadata: Metadata = {
  title: "Data Pengajar",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function GuruPage() {
  return <Guru/>
}