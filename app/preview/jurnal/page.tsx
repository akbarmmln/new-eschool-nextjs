import { Suspense } from "react";
import type { Metadata } from "next";
import PreviewJurnal from '@/components/ui/PreviewJurnal'

export const metadata: Metadata = {
  title: "Preview Jurnal",
  icons: {
    icon: "/assets/img/icons/education.svg"
  },
};

export default function PreviewJurnalPage() {
  return (
    <Suspense fallback={<div>Memuat Preview...</div>}>
      <PreviewJurnal />
    </Suspense>
  );
}