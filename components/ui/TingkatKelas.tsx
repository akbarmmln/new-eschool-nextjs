"use client";

import { useState, useEffect } from "react";
import { useListAllTingkatKelas } from "@/hooks/QueryTingkatKelas";

export default function TingkatKelas() {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, error, isFetching, refetch } = useListAllTingkatKelas(currentPage.toString(), keyword);

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
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Data Tingkatan Kelas
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Akademik</span>
              <span>/</span>
              <span>Tingkatan Kelas</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full max-w-xs">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pencarian"
                  className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none transition focus:border-blue-500"
                />
              </div>

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

          <div className="overflow-x-auto p-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-8 py-5 text-left font-semibold text-slate-800">
                    ID Tingkat
                  </th>

                  <th className="px-8 py-5 text-left font-semibold text-slate-800">
                    Kategori Tingkatan
                  </th>

                  <th className="px-8 py-5 text-center font-semibold text-slate-800">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading || isFetching ? (
                  <>
                  <TableSkeleton />
                  </>
                ) : data?.rows?.length > 0 ? (
                  <>
                    {data?.rows.map((item: any, index: number) => (
                      <tr key={item.id} className={index % 2 === 1 ? "bg-slate-50" : ""}>
                        <td className="px-8 py-3">
                          <span className="font-medium text-blue-400">
                            {item.id}
                          </span>
                        </td>

                        <td className="px-8 py-3 text-slate-600">
                          {item.nama}
                        </td>

                        <td className="px-8 py-3">
                          <div className="flex items-center justify-center gap-4">
                            {/* EDIT */}
                            <button
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                            >
                              <i className="ri-edit-line text-lg" />
                            </button>

                            {/* DELETE */}
                            <button
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500 transition hover:bg-red-500 hover:text-white"
                            >
                              <i className="ri-delete-bin-line text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </>
                ) : (
                <>
                  <tr>
                    <td colSpan={3} className="px-8 py-6 text-center text-lg text-slate-500 bg-slate-50">
                      Data tidak tersedia
                    </td>
                  </tr>
                </>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className={index % 2 === 1 ? "bg-slate-50" : ""}>
          <td className="px-8 py-3">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          </td>

          <td className="px-8 py-3">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          </td>

          <td className="px-8 py-3">
            <div className="flex justify-center gap-4">
              <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
              <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};