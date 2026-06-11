"use client";

import { useState, useEffect } from "react";
import { useProfileD2 } from '@/hooks/query'

export default function ProfileSayaDS2() {
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfileD2()
  
  const [openModalEditWalMur, setOpenModalEditWalMur] = useState(false);
  
  const handleOpenModalEditWalMur = () => {
    setOpenModalEditWalMur(true);
  }
  const handleCloseModalEditWalMur = () => {
    setOpenModalEditWalMur(true);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Profile
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Akademik</span>
              <span>/</span>
              <span>Pengaturan</span>
              <span>/</span>
              <span>Profile</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loadingCardProfile || isFetching ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="border-b border-slate-250 px-6 py-4 dark:border-slate-100 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-slate-800 dark:text-white">
                    Detail Wali Murid
                  </h2>

                  <button onClick={handleOpenModalEditWalMur}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                    <i className="ri-edit-line" />
                    Ubah
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

type DetailItemProps = { icon: React.ReactNode; title: string; value: string };
function DetailItem({ icon, title, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          {title}
        </h3>

        <div
          className="prose prose-sm mt-1 max-w-none text-slate-500 dark:prose-invert dark:text-slate-400"
          dangerouslySetInnerHTML={{
            __html: value || "-",
          }}
        />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />

      <div className="flex-1">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}