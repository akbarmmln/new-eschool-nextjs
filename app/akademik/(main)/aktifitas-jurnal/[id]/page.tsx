import type { Metadata } from "next";
import AktifitasJurnal from '@/components/ui/AktifitasJurnal'

export const metadata: Metadata = {
  title: "Detail Jurnal",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default async function AktifitasJurnalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AktifitasJurnal id={id} />
}