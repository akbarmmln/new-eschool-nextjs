"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import isEmpty from "@/utils/isEmpty";
const TTL = 5 * 60 * 1000; // 1 menit

export default function PreviewJurnal() {
  const searchParams = useSearchParams();
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    const channelId = searchParams.get("channel");

    if (!channelId) return;

    const storageKey = `preview-${channelId}`;
    const cache = sessionStorage.getItem(storageKey);

    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        if (Date.now() < parsed.expiredAt) {
          setPreviewData(parsed);
        } else {
          sessionStorage.removeItem(storageKey);
          const payload = {
            code: '000600',
            data: null,
            expiredAt: parsed.expiredAt
          }
          setPreviewData(payload);
          sessionStorage.setItem(
            storageKey,
            JSON.stringify({
              ...payload
            })
          );
        }
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    } else {
      const channel = new BroadcastChannel(`preview-${channelId}`);

      const listener = (event: MessageEvent) => {
        if (event.data?.type !== "DATA") return;

        const payload = {
          code: '000000',
          data: event.data.payload,
          expiredAt: Date.now() + TTL
        }

        setPreviewData(payload);

        sessionStorage.setItem(
          storageKey,
          JSON.stringify(payload)
        );

        channel.postMessage({ type: "RECEIVED" });
      };

      channel.addEventListener("message", listener);

      channel.postMessage({ type: "READY" });

      return () => {
        channel.removeEventListener("message", listener);
        channel.close();
      };
    }
  }, []);

  if (!previewData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Memuat Preview...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-white">
      {previewData.code === '000600' ? (
        <div className="flex h-screen items-center justify-center">
          Sesi waktu peninjauan habis...
        </div>
      ) : (
        <div className="flex h-screen flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h1 className="text-[20px] font-bold text-slate-800">
              PENILAIAN - {previewData.data.data.subParent.nama_siswa}
            </h1>
          </div>

          <div className="h-[calc(100vh-88px)] overflow-y-auto hide-scrollbar p-4 pb-32 md:p-6 md:pb-30">
            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-slate-200 px-4 py-5 text-center">
                      No
                    </th>

                    <th className="border border-slate-200 px-4 py-5 text-center">
                      Aktifitas
                    </th>

                    <th className="border border-slate-200 px-4 py-5 text-center">
                      Hasil
                    </th>

                    <th className="border border-slate-200 px-4 py-5 text-center">
                      Keterangan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {previewData.data.data.child.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="border border-slate-200 px-4 py-5 text-center">
                        {index + 1}.
                      </td>

                      <td className="border border-slate-200 px-4 py-5">
                        {item.item_silabus}
                      </td>

                      <td className="border border-slate-200 px-4 py-5">
                        {isEmpty(item.nilai) ? 'BELUM ADA PENILAIAN' : 
                          item.nilai == 1 ? 'Berkembang Sangat Baik' : 
                          item.nilai == 2 ? 'Berkembang Sesuai Harapan' :
                          item.nilai == 3 ? 'Mulai Berkembang' :
                          item.nilai == 4 ? 'Belum Berkembang' : 'BELUM ADA PENILAIAN'}
                      </td>

                      <td className="border border-slate-200 px-4 py-5">
                        {item.keterangan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
    // <div className="space-y-6">
    //   <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    //     <div>
    //       <h1 className="text-2xl text-slate-800 dark:text-white">
    //         Preview Jurnal
    //       </h1>

    //       <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
    //         <span>Akademik</span>
    //         <span>/</span>
    //         <span>Preview Jurnal Mengajar</span>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    //     <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800"></div>

    //     <div className="overflow-x-auto">
    //       {previewData.code === '000600' ? (
    //         "Sesi habis"
    //       ) : (
    //         "Selamat meninjau"
    //       )}
    //     </div>
    //   </div>
    // </div>
  )
}