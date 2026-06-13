"use client";

import { useAccessContext } from '@/context/AccessContext'
import { allowPage } from "@/utils/utils";
import { useState, useEffect } from "react";
import { useListRoleAcl, useUpdate } from "@/hooks/queryACL";
import Tooltip from "@/components/form/Tooltip";
import { useDropdownRole } from "@/hooks/queryACL";
import isEmpty from "@/utils/isEmpty";
import { showAlert } from "@/utils/swal";
import { useQueryClient } from '@tanstack/react-query';

export default function RoleAkses() {
  const allow_tipe = ['DS1'];
  const allow_role = ['0', '9'];
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [niy, setNiy] = useState('');
  const [nama, setNama] = useState('');
  const [roleNow, setRoleNow] = useState('');
  const [roleNew, setRoleNew] = useState('');

  const [fillDropdownRole, setFillDropdownRole] = useState<any[]>([]);

  const [openModalEdit, setOpenModalEdit] = useState(false);

  const dataAccess = useAccessContext()
  const id_account = dataAccess?.access?.id_account || '';
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

  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error, isFetching } = useListRoleAcl(currentPage.toString());

  const isEditFormValid = 
    !isEmpty(selectedId) &&
    !isEmpty(niy) &&
    !isEmpty(nama) &&
    !isEmpty(roleNow) &&
    !isEmpty(roleNew);

  useEffect(() => {
    if (openModalEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEdit]);

  const dropDown = useDropdownRole();
  const update = useUpdate();
  const handleOpenModalEdit = async (id: string, niy: string, nama: string, roleNow: string, accountId: string) => {
    let tempRoleNow;
    if (roleNow == '0') {
      tempRoleNow = 'Admin'
    } else if (roleNow == '1') {
      tempRoleNow = 'User'
    } else {
      tempRoleNow = ''
    }

    setSelectedId(id);
    setSelectedAccountId(accountId);
    setNiy(niy);
    setNama(nama);
    setRoleNow(tempRoleNow);
    setOpenModalEdit(true);
    
    const data = await dropDown.mutateAsync();

    setFillDropdownRole(data);
  }
  const handleCloseModalEdit = () => {
    setSelectedId('');
    setNiy('');
    setNama('');
    setRoleNow('');
    setRoleNew('')
    setFillDropdownRole([])

    setOpenModalEdit(false);
  }
  const handleSaveUpdate = async () => {
    try {
      const selected = fillDropdownRole.find(
        (item) => item.nama === roleNew
      );

      const payload = {
        niy: niy,
        role_code: selected?.code
      }

      const hasil = await update.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Role akses berhasil diperbaharui"
      );

      handleCloseModalEdit();

      await queryClient.invalidateQueries({
        queryKey: ['all-role-acl'],
      });

      console.log('asdasdasasd', id_account, selectedAccountId)
      if (id_account === selectedAccountId) {
        await showAlert(
          "warning",
          "Sesi Berakhir",
          "Terlah terjadi perubahan role akses pada data Anda. Demi keamanan, Anda akan ter-logout otomatis. Login kembali untuk melanjutkan."
        );
        sessionStorage.removeItem("access-token");
        localStorage.clear();

        window.location.replace("/akademik/login");

        return;
      }
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui role akses: ${e.err_msg}`,
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Daftar Akses Kontrol
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Akademik</span>
              <span>/</span>
              <span>A C L</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-xs"></div>

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
          ) : data?.rows?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full mb-5">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        NIY
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Nama Guru
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Email
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Role
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Jabatan
                      </th>

                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.rows.map((item: any, index: number) => (
                    <tr key={item.id} className={`${index % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.03]" : ""} border-b border-slate-100 dark:border-slate-800`}>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.adr_teacher.niy || '-'}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.adr_teacher.nama || '-'}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.adr_teacher.email || '-'}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.role == '0' ? 'Admin' : item.role == '1' ? 'User': ''}
                      </td>
                      <td className="px-8 py-3 text-slate-600 dark:text-slate-300">
                        {item.adr_teacher.jabatan || '-'}
                      </td>
                      <td className="px-8 py-3">
                        {role == '0' ? (
                          <div className="flex items-center justify-center gap-4">
                            <Tooltip text={`Ubah Akses ${item.adr_teacher.nama}`}>
                              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                onClick={() => handleOpenModalEdit(item.id, item.adr_teacher.niy, item.adr_teacher.nama, item.role, item.adr_teacher.id)}>
                                <i className="ri-lock-unlock-line"></i>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        NIY
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Nama Guru
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Email
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Role
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Jabatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-lg text-slate-500 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-400">
                        Data tidak tersedia
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>

      {openModalEdit && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Role Akses
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
                    NIY
                  </label>

                  <input
                    type="text"
                    value={niy}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama
                  </label>

                  <input
                    type="text"
                    value={nama}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role Akses Saat ini
                  </label>

                  <input
                    type="text"
                    value={roleNow}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Role Akses Baru
                  </label>
                  <div className="input-icon mt-2">
                    {dropDown.isPending ? (
                      <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                    ) : (
                    <>
                      <select value={roleNew || ''}
                        onChange={(e) =>
                          setRoleNew(e.target.value)
                        } >
                        <option value="">
                          Pilih
                        </option>

                        {
                          fillDropdownRole?.map((item) => (
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
                  : "Simpan Data"}
              </button>
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