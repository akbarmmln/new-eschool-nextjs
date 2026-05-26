import type { Metadata } from "next";
import AktifitasJurnalClient from '@/components/ui/AktifitasJurnalClient'

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
  return <AktifitasJurnalClient id={id} />
}