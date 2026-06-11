"use client";

import { useState, useEffect } from "react";
import { useProfileD2 } from '@/hooks/query'
import Image from "next/image";
import { formatTanggalIndonesia, hitungUsiaDetail } from "@/utils/utils";
import dayjs from 'dayjs'

export default function DashboardWalMur() {
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfileD2()
  console.log('sadasdasd', data)
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [detailSiswa, setDetailSiswa] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleSelectAnak = async (anak: any) => {
      try {
        setSelectedChild(anak);
        setLoadingDetail(true);
      } catch (e) {

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
              const active =
                selectedChild?.id === anak.id;

              return (
                <button key={anak.id} onClick={() => handleSelectAnak(anak)}
                  className={`shrink-0 w-[280px] rounded-2xl border-2 p-6 text-left transition
                    ${active ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}
                  `} >

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

      {selectedChild && (
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
                  -
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
                  -
                </div>
              </div>
            </div>
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