import type { Metadata } from "next";
import PengaturanSitus from '@/components/ui/PengaturanSitus'

export const metadata: Metadata = {
  title: "Pengaturan Situs",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function PengaturanSitusPage() {
  return <PengaturanSitus/>
}