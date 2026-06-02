"use client";

import { useState, useEffect } from "react";
import { useListAllKelas, useCreate, useUpdate, useDelete } from "@/hooks/queryKelas";
import { useDropdownTingkatKelas } from "@/hooks/QueryTingkatKelas";
import { useDropdownGuru } from "@/hooks/queryGuru";
import { useAccessContext } from '@/context/AccessContext'
import Link from "next/link";
import Tooltip from "@/components/form/Tooltip";
import isEmpty from "@/utils/isEmpty";
import { showAlert } from "@/utils/swal";
import { allowPage } from "@/utils/utils";

export default function Kelas() {
  const allow_tipe = ['DS1'];
  const allow_role = ['0', '1'];

  const dataAccess = useAccessContext()
  const tipe_account = dataAccess?.access?.tipe_account || '';
  const role = dataAccess?.access?.role || '';
  const isAllowed = allowPage(allow_tipe, allow_role, tipe_account, role)

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, error, isFetching, refetch } = useListAllKelas(currentPage.toString(), keyword);

  const {
    isLoading: isLoadingTingkatKelas,
    isFetching: isFetchingTingkatKelas,
    refetch: refetchTingkatKelas,
  } = useDropdownTingkatKelas({
    enabled: false,
  });

  const [idKelas, setIdKelas] = useState('')
  const [namaKelas, setNamaKelas] = useState('')
  const [tingkatKelas, setTingkatKelas] = useState('')
  const [waliKelas, setWaliKelas] = useState('')
  const [waliKelasId, setWaliKelasId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [isSelectingGuru, setIsSelectingGuru] = useState(false);

  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedNama, setSelectedNama] = useState<any>(null);

  const [namaKelasAdd, setNamaKelasAdd] = useState('')
  const [tingkatKelasAdd, setTingkatKelasAdd] = useState('')

  const [fillDropdownTingkatKelas, setFillDropdownTingkatKelas] = useState<any[]>([]);

  const {
    data: guruList = [],
    isLoading: isLoadingGuruList,
    isFetching: isFetchingGuruList,
  } = useDropdownGuru(debouncedKeyword, {
    enabled: debouncedKeyword.trim().length > 0,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      setKeyword(search);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(waliKelas);
    }, 500);

    return () => clearTimeout(timer);
  }, [waliKelas]);

  useEffect(() => {
    if (!isSelectingGuru && debouncedKeyword.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedKeyword, isSelectingGuru]);

  const isEditFormValid =
    !isEmpty(idKelas) &&
    !isEmpty(namaKelas) &&
    !isEmpty(tingkatKelas) &&
    !isEmpty(waliKelasId);

  const update = useUpdate();
  const handleOpenModalEdit = async (id_kelas: string, nama_kelas: string, tingkat_kelas: string, wali_kelas: string, id_wali_kelas: string) => {
    setIdKelas(id_kelas || '');
    setNamaKelas(nama_kelas || '');
    setTingkatKelas(tingkat_kelas || '');
    setWaliKelas(wali_kelas || '');
    setWaliKelasId(id_wali_kelas);

    setOpenModalEdit(true)

    const result = await refetchTingkatKelas();
    setFillDropdownTingkatKelas(result.data ?? [])
  }
  const handleCloseModalEdit = () => {
    setIdKelas('');
    setNamaKelas('');
    setTingkatKelas('');
    setWaliKelas('');
    setWaliKelasId('');

    setFillDropdownTingkatKelas([])
    setOpenModalEdit(false)
  }
  const handleSaveUpdate = async () => {
    try {
      const selected = fillDropdownTingkatKelas.find(
        (item) => item.nama === tingkatKelas
      );
      const tingkatKelasId = selected?.id || "";
      const payload = {
        id_kelas: idKelas,
        nama_kelas: namaKelas,
        id_wali_kelas: waliKelasId,
        id_tingkatan_kelas: tingkatKelasId
      }

      const hasil = await update.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data ruang kelas berhasil diperbaharui"
      );

      handleCloseModalEdit();

      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data ruang kelas: ${e.err_msg}`,
      );
    }
  }

  const deletes = useDelete();
  const handleOpenModalDelete = (id_kelas: string, nama_kelas: string) => {
    setSelectedId(id_kelas);
    setSelectedNama(nama_kelas);

    setOpenModalDelete(true);
  }
  const handleCloseModalDelete = () => {
    setSelectedId('');
    setSelectedNama('');

    setOpenModalDelete(false);
  }
  const handleSaveDelete = async () => {
    try {
      const payload = {
        id: selectedId
      };

      const hasil = await deletes.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data ruang kelas berhasil dihapus"
      );

      handleCloseModalDelete();

      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal menghapus data ruang kelas: ${e.err_msg}`,
      );
    }
  }

  const isAddFormValid =
    !isEmpty(namaKelasAdd) &&
    !isEmpty(tingkatKelasAdd) &&
    !isEmpty(waliKelasId);

  const create = useCreate();
  const handleOpenModalAdd = async () => {
    setNamaKelasAdd('');
    setTingkatKelasAdd('');
    setWaliKelas('');
    setWaliKelasId('');

    setOpenModalAdd(true)

    const result = await refetchTingkatKelas();
    setFillDropdownTingkatKelas(result.data ?? [])
  }
  const handleCloseModalAdd = () => {
    setNamaKelasAdd('');
    setTingkatKelasAdd('');
    setWaliKelas('');
    setWaliKelasId('');

    setFillDropdownTingkatKelas([])
    setOpenModalAdd(false)
  }
  const handleSaveCreate = async () => {
    try {
      const selected = fillDropdownTingkatKelas.find(
        (item) => item.nama === tingkatKelasAdd
      );
      const tingkatKelasId = selected?.id || "";

      const payload = {
        nama_kelas: namaKelasAdd,
        id_wali_kelas: waliKelasId,
        id_tingkatan_kelas: tingkatKelasId
      }

      const hasil = await create.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data ruang kelas berhasil ditambahkan"
      );

      handleCloseModalAdd();

      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal menambah data ruang kelas: ${e.err_msg}`,
      );

    }
  }

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

  if (!isAllowed) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-red-600">
        Maaf Anda tidak bisa mengakses halaman ini
      </div>
    );
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
                  <button onClick={handleOpenModalAdd}
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
                        <Link href={`/akademik/some-thing-new/${item.id}`} className="font-medium text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
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
                              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                onClick={() => handleOpenModalEdit(item.id, item.nama_kelas, item.nama_tingkat_kelas, item.wali_kelas, item.id_wali_kelas)}>
                                <i className="ri-edit-line text-lg" />
                              </button>
                            </Tooltip>
                            <Tooltip text={`Hapus Data ${item.nama_kelas}`}>
                              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-500 transition hover:bg-red-500 hover:text-white"
                                onClick={() => handleOpenModalDelete(item.id, item.nama_kelas)}>
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

      {openModalAdd && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Tambah Ruang Kelas
              </h2>

              <button
                onClick={handleCloseModalAdd}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                <i
                  className="ri-close-line"
                  style={{ fontSize: 30 }}
                />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Kelas
                </label>

                <input
                  type="text"
                  value={namaKelasAdd}
                  onChange={(e) => setNamaKelasAdd(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div className="form-group">
                <label>
                  Tingkat Kelas
                </label>
                <div className="input-icon mt-2">
                  {isLoadingTingkatKelas || isFetchingTingkatKelas ? (
                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                  ) : (
                    <>
                      <select value={tingkatKelasAdd}
                        onChange={(e) =>
                          setTingkatKelasAdd(e.target.value)
                        } >
                        <option value="">
                          Pilih
                        </option>

                        {
                          fillDropdownTingkatKelas?.map((item) => (
                            <option key={item.id} value={item.nama} >
                              {item.nama}
                            </option>
                          ))
                        }
                      </select>
                      <i className="ri-arrow-down-s-line" />
                    </>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Wali Kelas
                </label>

                <input
                  type="text"
                  value={waliKelas}
                  onChange={(e) => {
                    setIsSelectingGuru(false);
                    setWaliKelas(e.target.value);
                    setWaliKelasId('');
                  }}
                  placeholder="Cari wali kelas..."
                  className="h-[48px] w-full rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-blue-500"
                />

                {showDropdown && (
                  <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                    {isLoadingGuruList || isFetchingGuruList ? (
                      <div className="px-5 py-4 text-slate-500">
                        Mencari data...
                      </div>
                    ) : guruList.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto">
                        {guruList.map((guru: any) => (
                          <button className="w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50"
                            key={guru.id}
                            type="button"
                            onClick={() => {
                              setIsSelectingGuru(true);
                              setWaliKelasId(guru.id);
                              setWaliKelas(guru.nama);
                              setShowDropdown(false);
                            }} >
                            <div className="font-semibold text-slate-800">
                              {guru.nama}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                              {guru.id}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-4 text-center text-slate-500">
                        Data guru tidak ditemukan
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
              <button
                onClick={() => handleCloseModalAdd()}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                Batalkan
              </button>

              <button
                disabled={!isAddFormValid || create.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isAddFormValid || create.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}
                onClick={() => handleSaveCreate()}>

                {create.isPending
                  ? "Menyimpan..."
                  : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {openModalEdit && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Data Ruang Kelas
                </h2>

                <button
                  onClick={handleCloseModalEdit}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                  <i
                    className="ri-close-line"
                    style={{ fontSize: 30 }}
                  />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    ID Tingkat
                  </label>

                  <input
                    type="text"
                    value={idKelas}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Kelas
                  </label>

                  <input
                    type="text"
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Tingkat Kelas
                  </label>
                  <div className="input-icon mt-2">
                    {isLoadingTingkatKelas || isFetchingTingkatKelas ? (
                      <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                    ) : (
                      <>
                        <select value={tingkatKelas}
                          onChange={(e) =>
                            setTingkatKelas(e.target.value)
                          } >
                          <option value="">
                            Pilih
                          </option>

                          {
                            fillDropdownTingkatKelas?.map((item) => (
                              <option key={item.id} value={item.nama} >
                                {item.nama}
                              </option>
                            ))
                          }
                        </select>
                        <i className="ri-arrow-down-s-line" />
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Wali Kelas
                  </label>

                  <input
                    type="text"
                    value={waliKelas}
                    onChange={(e) => {
                      setIsSelectingGuru(false);
                      setWaliKelas(e.target.value);
                      setWaliKelasId('');
                    }}
                    placeholder="Cari wali kelas..."
                    className="h-[48px] w-full rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-blue-500"
                  />

                  {showDropdown && (
                    <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                      {isLoadingGuruList || isFetchingGuruList ? (
                        <div className="px-5 py-4 text-slate-500">
                          Mencari data...
                        </div>
                      ) : guruList.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {guruList.map((guru: any) => (
                            <button className="w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50"
                              key={guru.id}
                              type="button"
                              onClick={() => {
                                setIsSelectingGuru(true);
                                setWaliKelasId(guru.id);
                                setWaliKelas(guru.nama);
                                setShowDropdown(false);
                              }} >
                              <div className="font-semibold text-slate-800">
                                {guru.nama}
                              </div>

                              <div className="mt-1 text-sm text-slate-500">
                                {guru.id}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-4 text-center text-slate-500">
                          Data guru tidak ditemukan
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
                <button
                  onClick={() => handleCloseModalEdit()}
                  className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                  Batalkan
                </button>

                <button
                  disabled={!isEditFormValid || update.isPending}
                  className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormValid || update.isPending
                      ? "cursor-not-allowed bg-slate-400 shadow-none"
                      : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                    }`}
                  onClick={() => handleSaveUpdate()}>

                  {update.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {openModalDelete && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
              <div className="p-8">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
                  <i className="ri-delete-bin-6-line text-5xl text-red-500" />
                </div>

                {/* Title */}
                <h2 className="mb-4 text-center text-xl font-bold text-slate-700">
                  Konfirmasi Penghapusan
                </h2>

                {/* Message */}
                <p className="text-center text-base leading-relaxed text-slate-600">
                  Anda akan menghapus kelas{" "}
                  <span className="font-bold text-slate-800">
                    {selectedNama}
                  </span>
                  , tindakan ini tidak dapat dibatalkan setelah Anda menghapusnya.
                </p>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button className="rounded-xl bg-slate-100 px-8 py-4 text-lg font-medium text-slate-700 transition hover:bg-slate-200"
                    onClick={handleCloseModalDelete}>
                    Batalkan
                  </button>

                  <button
                    disabled={deletes.isPending}
                    className="rounded-xl bg-red-500 px-8 py-4 text-lg font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                    onClick={handleSaveDelete}>

                    {deletes.isPending
                      ? "Menghapus..."
                      : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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