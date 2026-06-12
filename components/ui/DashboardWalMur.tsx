"use client";

import { useState, useEffect } from "react";
import { useProfileD2 } from '@/hooks/query'
import { useRenderDetailCardAnak } from '@/hooks/queryJurnal'
import Image from "next/image";
import { formatTanggalIndonesia, hitungUsiaDetail } from "@/utils/utils";
import dayjs from 'dayjs'
import Link from "next/link";

export default function DashboardWalMur() {
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfileD2()

  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [detailSiswa, setDetailSiswa] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    console.log('detailSiswa', detailSiswa)
  }, [detailSiswa]);


  const details = useRenderDetailCardAnak()
  const handleSelectAnak = async (anak: any) => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 20);
      const public_date_to = dayjs(today).format('DD-MM-YYYY')
      const public_date_from = dayjs(sevenDaysAgo).format('DD-MM-YYYY')
      
      if (loadingDetail) return;

      setSelectedChild(anak);
      setLoadingDetail(true);

      const payload = {
        page: '1',
        body: {
          id_siswa: anak.id,
          dari: public_date_from,
          sampai: public_date_to
        }
      }

      const hasil: any = await details.mutateAsync(payload)
      const detailData = {
        anak,
        ...hasil.data.data
      }
      setDetailSiswa(detailData);
    } catch (e) {
      setSelectedChild(null);
      setDetailSiswa(null)
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-[#24305B] p-6">
        <div className="relative z-10 flex items-center gap-5">
          <Image
            src="/assets/img/icons/student_new.svg"
            alt="Wali Murid"
            width={120}
            height={120}
            className="shrink-0"
          />

          <div>
            <div className="mb-2 inline-flex rounded bg-white px-3 py-1 text-sm text-blue-600">
              #{data?.id}
            </div>

            <h2 className="mb-1 text-xl font-bold text-white">
              Wali Murid
            </h2>

            <div className="flex flex-wrap gap-2 text-base text-white/80">
              <span>
                Aktif sejak :
                {" "}
                {`${formatTanggalIndonesia(dayjs(data?.created_dt).format('YYYY-MM-DD'))}`}
              </span>

              <span>|</span>

              <span>
                {data?.child.length}
                {" "}
                Anak
              </span>
            </div>
          </div>
        </div>
      </div>

      {loadingCardProfile ? (
        <div className="mt-8 overflow-x-auto hide-scrollbar">
          <div className="flex gap-5 pb-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="shrink-0 w-[280px] animate-pulse rounded-2xl border-2 border-slate-200 bg-white p-6">
                {/* Nama */}
                <div className="mb-8 flex justify-center">
                  <div className="h-8 w-44 rounded-lg bg-slate-200" />
                </div>

                {/* Detail */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-24 rounded bg-slate-200" />
                    <div className="h-5 w-20 rounded bg-slate-200" />
                  </div>

                  <div className="h-16 w-px bg-slate-200" />

                  <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-20 rounded bg-slate-200" />
                    <div className="h-5 w-16 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto hide-scrollbar">
          <div className="flex gap-5 pb-2">
            {data?.child.map((anak: any) => {
              const active = selectedChild?.id === anak.id;

              return (
                <button key={anak.id}
                  disabled={loadingDetail}
                  onClick={() => handleSelectAnak(anak)}
                  className={`shrink-0 w-[280px] rounded-2xl border-2 p-6 text-left transition
                    ${active ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}
                    ${loadingDetail ? "cursor-not-allowed opacity-70" : "hover:border-blue-300"}`} >

                  <h3 className="mb-6 text-center text-base font-semibold text-slate-700">
                    {anak.nama}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-medium text-slate-500">
                        {anak.nama_kelas}
                      </div>
                    </div>

                    <div className="h-16 w-px bg-slate-300" />

                    <div className="text-center">
                      <div className="text-lg font-medium text-slate-500">
                        {hitungUsiaDetail(anak.tanggal_lahir)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loadingDetail ? (
        <DetailSkeleton />
      ) : detailSiswa && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-red-50 p-4">
                <i className="ri-id-card-line text-2xl text-red-500" />
              </div>

              <div>
                <div className="font-bold">
                  ID Siswa
                </div>

                <div>
                  {detailSiswa?.anak.id || '-'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-red-50 p-4">
                <i className="ri-graduation-cap-line text-2xl text-red-500" />
              </div>

              <div>
                <div className="font-bold">
                  Nama Siswa
                </div>

                <div>
                  {detailSiswa?.anak.nama || '-'}
                </div>
              </div>
            </div>
          </div>

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Materi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Refleksi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Kelas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Pengajar
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {detailSiswa.rows.length == 0 ? (
                    <>
                      <tr>
                        <td colSpan={7} className="px-8 py-6 text-center text-lg text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-400">
                          Data tidak tersedia
                        </td>
                      </tr>
                    </>
                  ) : (
                    detailSiswa?.rows.map((item: any, index: number) => (
                      <tr key={item.id} className={`${index % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.03]" : ""} border-b border-slate-100 dark:border-slate-800`}>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {index + 1}.
                        </td>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {formatTanggalIndonesia(item.tanggal_jurnal) || '-'}
                        </td>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {renderHtml(item.materi || '-')}
                        </td>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {renderHtml(item.refleksi || '-')}
                        </td>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {item.nama_kelas || '-'}
                        </td>
                        <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                          {item.nama_guru || '-'}
                        </td>
                        <td className="px-8 py-3">
                          <Link href={`/akademik/wali-jurnal/${item.id}/${detailSiswa.anak.id}`} className="font-medium text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Lihat Detail  
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
      )}

      <style jsx global>
        {`
            .hide-scrollbar {
              overflow-y: auto;
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            .hide-scrollbar::-webkit-scrollbar {
              width: 0;
              height: 0;
              display: none;
            }
          `}
      </style>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-8 animate-pulse rounded-2xl border border-slate-200 bg-white p-6">

      {/* Header Detail */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-slate-200" />

          <div className="flex-1">
            <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
            <div className="h-5 w-56 rounded bg-slate-200" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-slate-200" />

          <div className="flex-1">
            <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
            <div className="h-5 w-64 rounded bg-slate-200" />
          </div>
        </div>

      </div>

      {/* Table Skeleton */}
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">

        {/* Header */}
        <div className="grid grid-cols-7 gap-4 bg-slate-100 p-4">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="h-5 rounded bg-slate-200"
            />
          ))}
        </div>

        {/* Rows */}
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="grid grid-cols-7 gap-4 border-t border-slate-100 p-4"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((col) => (
              <div
                key={col}
                className="h-4 rounded bg-slate-200"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHtml(value: string) {
  if (!value) {
    return "-";
  }

  return (
    <div
      className="journal-text"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    />
  );
}