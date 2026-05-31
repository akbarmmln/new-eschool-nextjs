import type { Metadata } from "next";
import AktifitasJurnalSide from '@/components/ui/AktifitasJurnal'

export const metadata: Metadata = {
  title: "Detail Jurnal",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default async function AktifitasJurnal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AktifitasJurnalSide id={id} />
}