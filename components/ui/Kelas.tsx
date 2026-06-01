"use client";

import { useState, useEffect } from "react";
import { useListAllKelas } from "@/hooks/queryKelas";
import { useAccessContext } from '@/context/AccessContext'
import Link from "next/link";
import Tooltip from "@/components/form/Tooltip";

export default function Kelas() {
  const dataAccess = useAccessContext()
  const role = dataAccess?.access?.role;

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, error, isFetching, refetch } = useListAllKelas(currentPage.toString(), keyword);
  console.log('sadasdasdasd', data);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      setKeyword(search);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  function getPaginationItems(current: number, total: number) {
    const items: (number | string)[] = []

    // TOTAL <= 6
    if (total <= 6) {
      for (let i = 1; i <= total; i++) {
        items.push(i)
      }
      return items
    }

    // PAGE AWAL
    if (current <= 4) {
      items.push(1, 2, 3, 4, 5)
      items.push('...')
      items.push(total)
      return items
    }

    // PAGE AKHIR
    if (current >= total - 3) {
      items.push(1)
      items.push('...')
      for (let i = total - 4; i <= total; i++) {
        items.push(i)
      }
      return items
    }

    // PAGE TENGAH
    items.push(1)
    items.push('...')
    items.push(current - 1, current, current + 1)
    items.push('...')
    items.push(total)
    return items
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Data Ruang Kelas
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Akademik</span>
              <span>/</span>
              <span>Ruang Kelas</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {role == '0' ? (
              isLoading || isFetching ? (
              <>
                  <div className="h-[46px] w-[140px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
              </>
              ) : (
                <>
                  <button
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <i className="ri-add-circle-fill text-xl text-blue-500" />
                    Tambah Data
                  </button>
                </>
              )
            ) : ''
            }
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full max-w-xs">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pencarian"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none transition text-slate-800 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>

              {/* PAGINATION */}
              {!isLoading && !isFetching && data?.rows?.length > 0 && (
                <>
                  {/* DESKTOP */}
                  <div className="hidden md:flex items-center justify-end gap-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {
                        getPaginationItems(currentPage, data?.totalPage).map((item, index) => {
                          if (item === '...') {
                            return (
                              <span
                                key={index}
                                className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400" >
                                ...
                              </span>
                            )
                          }

                          const isActive = currentPage === item

                          return (
                            <button
                              key={index}
                              onClick={() =>
                                setCurrentPage(Number(item))
                              }
                              className={`w-11 h-11 rounded-2xl text-sm font-semibold transition-all ${isActive
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`} >
                              {item}
                            </button>
                          )

                        })
                      }
                    </div>

                    <button
                      disabled={
                        currentPage === data?.totalPage
                      }
                      onClick={() =>
                        setCurrentPage(currentPage + 1)
                      }
                      className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" >
                      Next
                    </button>
                  </div>

                  {/* MOBILE */}
                  <div className="flex md:hidden items-center justify-between mt-6 mb-8 gap-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-2xl text-gray-700 shadow-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
                      ←
                    </button>

                    <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Halaman {currentPage} dari {data?.totalPage}
                    </div>

                    <button
                      disabled={
                        currentPage === data?.totalPage
                      }
                      onClick={() =>
                        setCurrentPage(currentPage + 1)
                      }
                      className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-2xl text-gray-700 shadow-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {isLoading || isFetching ? (
            <TableSkeleton />
          ) : data?.rows?.length > 0 ?  (
            <div className="overflow-x-auto">
              <table className="w-full mb-5">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      ID Kelas
                    </th>

                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Nama Kelas
                    </th>

                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Wali Kelas
                    </th>

                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Tingkat Kelas
                    </th>

                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {role == '0' ? 'Aksi' : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.rows.map((item: any, index: number) => (
                    <tr key={item.id} className={`${index % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.03]" : ""} border-b border-slate-100 dark:border-slate-800`}>
                      <td className="px-8 py-3">
                        <Link href={`/akademik/detail-tingkat-kelas/${item.id}`} className="font-medium text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          {item.id}
                        </Link>
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.nama_kelas || '-'}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.wali_kelas || '-'}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.nama_tingkat_kelas || '-'}
                      </td>
                      <td className="px-8 py-3">
                        {role == '0' ? (
                          <div className="flex items-center justify-center gap-4">
                            <Tooltip text={`Ubah Data ${item.nama_kelas}`}>
                              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white">
                                <i className="ri-edit-line text-lg" />
                              </button>
                            </Tooltip>
                            <Tooltip text={`Hapus Data ${item.nama_kelas}`}>
                              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500 transition hover:bg-red-500 hover:text-white">
                                <i className="ri-delete-bin-line text-lg" />
                              </button>
                            </Tooltip>
                          </div>
                        ) : ''
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        ID Kelas
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Nama Kelas
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Wali Kelas
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Tingkat Kelas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="px-8 py-6 text-center text-lg text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-400">
                        Data tidak tersedia
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            <th className="px-6 py-4 text-left">
              <div className="h-4 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>

            <th className="px-6 py-4 text-left">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>

            <th className="px-6 py-4 text-left">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>
          </tr>
        </thead>

        <tbody>
          {[...Array(2)].map((_, index) => (
            <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-6 py-5">
                <div className="h-4 w-6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </td>

              <td className="px-6 py-5">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </td>

              <td className="px-6 py-5">
                <div className="flex gap-4">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}