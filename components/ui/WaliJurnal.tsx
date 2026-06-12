"use client";

type Props = {
  idJurnal: string;
  idSiswa: string
};

import { allowPage } from "@/utils/utils";
import { useAccessContext } from '@/context/AccessContext'
import { useWaliJurnalSiswaDetails } from "@/hooks/query";
import { formatTanggalIndonesia } from "@/utils/utils";

export default function WaliJurnal({ idJurnal, idSiswa }: Props) {
  const allow_tipe = ['DS2'];
  const allow_role = ['2'];

  const dataAccess = useAccessContext()
  const tipe_account = dataAccess?.access?.tipe_account || '';
  const role = dataAccess?.access?.role || '';

  const isAllowed = allowPage(allow_tipe, allow_role, tipe_account, role)
  
  if (!isAllowed) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-red-600">
        Maaf Anda tidak bisa mengakses halaman ini
      </div>
    );
  }

  const { data, isLoading, error, isFetching, refetch } = useWaliJurnalSiswaDetails(idJurnal, idSiswa);

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-red-600">
        Maaf terjadi kesalahan saat memproses data
      </div>
    );
  }

  return (
    <>
      {isLoading || isFetching ? (
        <>
          <div className="space-y-6 animate-pulse">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                {/* Title */}
                <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />

                {/* Breadcrumb */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(6)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-6 animate-pulse">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl text-slate-800 dark:text-white">
                  Detail Jurnal {data.subParent.nama_siswa}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <span>Akademik</span>
                  <span>/</span>
                  <span>Jurnal Mengajar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <DetailItem
                icon={
                  <i
                    className="ri-calendar-2-line"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Tanggal dan Jam Mengajar"
                value={`${formatTanggalIndonesia(data?.parent?.tanggal_jurnal)} • ${data?.parent?.jam_mulai} - ${data?.parent?.jam_selesai}`}
              />

              <DetailItem
                icon={
                  <i
                    className="ri-building-line"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Kelas"
                value={data?.parent?.nama_kelas || '-'}
              />

              <DetailItem
                icon={
                  <i
                    className="ri-book-open-line"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Materi"
                value={data?.parent?.materi || '-'}
                isHtml={true}
              />

              <DetailItem
                icon={
                  <i
                    className="ri-user-voice-line"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Refleksi"
                value={data?.parent?.refleksi || '-'}
                isHtml={true}
              />

              <DetailItem
                icon={
                  <i
                    className="ri-presentation-line"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Pengajar"
                value={data?.parent?.nama_guru || "-"}
              />

              <DetailItem
                icon={
                  <i
                    className="ti ti-bookmark-edit me-2"
                    style={{ fontSize: 22 }}
                  />
                }
                title="Kehadiran"
                  value={data?.subParent?.absensi == 1
                    ? "Hadir"
                    : data?.subParent?.absensi == 2
                    ? "Ijin"
                    : data?.subParent?.absensi == 3
                    ? "Sakit"
                    : data?.subParent?.absensi == 4
                    ? "Alpha"
                    : "-"}
              />
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-250 px-6 py-4 dark:border-slate-100 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Kegitan Belajar
                </h2>
              </div>
            </div>

            <div className="dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Tema Pembelajaran
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Materi Belajar
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.child.length == 0 ? (
                      <>
                        <tr>
                          <td colSpan={3} className="px-8 py-6 text-center text-lg text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-400">
                            Data tidak tersedia
                          </td>
                        </tr>
                      </>
                    ) : (
                      data.child.map((item: any, index: number) => (
                        <tr key={item.id} className={`${index % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.03]" : ""} border-b border-slate-100 dark:border-slate-800`}>
                          <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                            {index + 1}.
                          </td>
                          <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                            {item.title_silabus || '='}
                          </td>
                          <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                            {item.item_silabus || '='}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
                  
              .journal-text :global(ol) {
                list-style: decimal;
                margin-left: 20px;
                padding-left: 10px;
              }

              .journal-text :global(ul) {
                list-style: disc;
                margin-left: 20px;
                padding-left: 10px;
              }

              .journal-text :global(li) {
                display: list-item;
              }
          `}
          </style>
        </>
      )}
    </>)
}

type DetailItemProps = { icon: React.ReactNode; title: string; value: string, isHtml?: boolean; };

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

function DetailItem({ icon, title, value, isHtml = false }: DetailItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          {title}
        </h3>

        {isHtml ? (
          <div
            className="journal-text prose prose-sm mt-1 max-w-none text-slate-500 dark:prose-invert dark:text-slate-400"
            dangerouslySetInnerHTML={{
              __html: value || "-",
            }}
          />
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-slate-500 dark:text-slate-400">
            {value || "-"}
          </p>
        )}
      </div>
    </div>
  );
}