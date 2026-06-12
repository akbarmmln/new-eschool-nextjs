import type { Metadata } from "next";
import WaliJurnal from '@/components/ui/WaliJurnal'

export const metadata: Metadata = {
  title: "Wali Jurnal Detail",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default async function WaliJurnalPage({
  params
}: {
  params: Promise<{ idJurnal: string, idSiswa: string }>;
}) {
  const { idJurnal, idSiswa } = await params;
  return <WaliJurnal idJurnal={idJurnal} idSiswa={idSiswa}/>
}