"use client";

import { useState, useEffect } from "react";
import { useProfileD2, useWalMurDataUpdate, useUpdateEmail, useUpdatePassword } from '@/hooks/query'
import isEmpty from "@/utils/isEmpty";
import { showAlert } from "@/utils/swal";
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileSayaDS2() {
  const queryClient = useQueryClient();
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfileD2()

  const [id, setId] = useState('');
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  const [emailLama, setEmailLama] = useState('');
  const [emailBaru, setEmailBaru] = useState('');
  const [passwordLama, setPasswordLama] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [passwordKonfBaru, setPasswordKonfBaru] = useState('')

  const [openModalEditWalMur, setOpenModalEditWalMur] = useState(false);
  const [openModalEditEmail, setOpenModalEditEmail] = useState(false);
  const [openModalEditPassword, setOpenModalEditPassword] = useState(false);
  
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showPasswordKonfBaru, setShowPasswordKonfBaru] = useState(false);

  useEffect(() => {
    if (openModalEditWalMur) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditWalMur]);
  useEffect(() => {
    if (openModalEditEmail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditEmail]);
  useEffect(() => {
    if (openModalEditPassword) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditPassword]);

  const isFormValid =
    !isEmpty(namaAyah) &&
    !isEmpty(namaIbu) &&
    !isEmpty(pekerjaanAyah) &&
    !isEmpty(pekerjaanIbu);

  const isEditFormEmailValid = !isEmpty(emailBaru);

  const isEditFormPasswordValid =
    !isEmpty(passwordLama) &&
    !isEmpty(passwordBaru) &&
    !isEmpty(passwordKonfBaru);

  const update = useWalMurDataUpdate();
  const handleOpenModalEditWalMur = (id: string, namaAyah: string, namaIbu: string, pekerjaanAyah: string, pekerjaanIbu: string) => {
    setId(id)
    setNamaAyah(namaAyah || '')
    setNamaIbu(namaIbu || '')
    setPekerjaanAyah(pekerjaanAyah || '')
    setPekerjaanIbu(pekerjaanIbu || '')
    setOpenModalEditWalMur(true)
  }
  const handleCloseModalEditWalMur = () => {
    setOpenModalEditWalMur(false)
    setId('')
    setNamaAyah('')
    setNamaIbu('')
    setPekerjaanAyah('')
    setPekerjaanIbu('')
  }
  const handleSave = async () => {
    try {
      const payload = {
        id: id,
        object_update: {
          nama_ayah: namaAyah,
          nama_ibu: namaIbu,
          pekerjaan_ayah: pekerjaanAyah,
          pekerjaan_ibu: pekerjaanIbu
        }
      }
      const hasil = await update.mutateAsync(payload)
      if (!hasil.ok) {
        throw hasil
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi pribadi berhasil diperbaharui"
      );

      handleCloseModalEditWalMur();

      await queryClient.invalidateQueries({
        queryKey: ['profiled2'],
      });
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data informasi pribadi`,
      );
    }
  }

  const updateEmail = useUpdateEmail()
  const handleOpenModalEditEmail = (id: string, email: string) => {
    setId(id)
    setEmailLama(email || '')
    setOpenModalEditEmail(true)
  }
  const handleCloseModalEditEmail = () => {
    setId('')
    setEmailLama('')
    setEmailBaru('')
    setOpenModalEditEmail(false)
  }
  const handleSaveEmail = async () => {
    try {
      const payload = {
        email_baru: emailBaru
      }
      const hasil = await updateEmail.mutateAsync(payload)
      if (!hasil.ok) {
        throw hasil
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi pribadi berhasil diperbaharui"
      );

      handleCloseModalEditEmail();

      await queryClient.invalidateQueries({
        queryKey: ['profiled2'],
      });
    } catch (e: any) {
      const err_msg = e.err_msg
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data informasi email: ${err_msg}`,
      );
    }
  }

  const updatePassword = useUpdatePassword();
  const handleOpenModalEditPassword = () => {
    setPasswordLama('')
    setPasswordBaru('')
    setPasswordKonfBaru('')

    setOpenModalEditPassword(true)
  }
  const handleCloseModalEditPassword = () => {
    setPasswordLama('')
    setPasswordBaru('')
    setPasswordKonfBaru('')

    setOpenModalEditPassword(false)
  }
  const handleSavePassword = async () => {
    try {
      const payload = {
        password_lama: passwordLama,
        password_baru: passwordBaru
      };

      if (passwordBaru != passwordKonfBaru) {
        await showAlert(
          "warning",
          "Peringatan",
          `Password baru tidak sama dengan konfirmasi password baru`,
        );
        return
      }

      const hasil = await updatePassword.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Password berhasil diperbaharui"
      );

      handleCloseModalEditPassword();

      await queryClient.invalidateQueries({
        queryKey: ['profiled2'],
      });
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui password: ${e.err_msg}`,
      );
    }
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

                  <button 
                    onClick={() => handleOpenModalEditWalMur(data?.id, data?.nama_ayah, data?.nama_ibu, data?.pekerjaan_ayah, data?.pekerjaan_ibu)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                    <i className="ri-edit-line" />
                    Ubah
                  </button>
                </div>
              </div>

              <div className="p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <DetailItem
                    icon={
                      <i
                        className="ti ti-man"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Nama Ayah Kadung"
                    value={!isEmpty(data?.nama_ayah) ? data?.nama_ayah : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-woman"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Nama Ibu Kandung"
                    value={!isEmpty(data?.nama_ibu) ? data?.nama_ibu : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-briefcase-2"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Pekerjaan Ayah"
                    value={!isEmpty(data?.pekerjaan_ayah) ? data?.pekerjaan_ayah : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-briefcase-2"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Pekerjaan Ibu"
                      value={!isEmpty(data?.pekerjaan_ibu) ? data?.pekerjaan_ibu : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-mail"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Email"
                    value={!isEmpty(data?.email) ? data?.email : '-'}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loadingCardProfile || isFetching ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-4 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Email
                </h2>

                <button 
                  onClick={() => handleOpenModalEditEmail(data?.id, data?.email)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                  <i className="ri-edit-line" />
                  Ubah
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loadingCardProfile || isFetching ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-4 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Kata Sandi
                </h2>

                <button onClick={handleOpenModalEditPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                  <i className="ri-edit-line" />
                  Ubah
                </button>
              </div>
            </div>
          )}
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
          `}
        </style>
      </div>

      {openModalEditWalMur && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Ubah Informasi Pribadi
              </h2>

              <button
                onClick={handleCloseModalEditWalMur}
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
                  Nama Lengkap Ayah
                </label>

                <input
                  type="text"
                  value={namaAyah}
                  onChange={(e) => setNamaAyah(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Lengkap Ibu
                </label>

                <input
                  type="text"
                  value={namaIbu}
                  onChange={(e) => setNamaIbu(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pekerjaan Ayah
                </label>

                <input
                  type="text"
                  value={pekerjaanAyah}
                  onChange={(e) => setPekerjaanAyah(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pekerjaan Ibu
                </label>

                <input
                  type="text"
                  value={pekerjaanIbu}
                  onChange={(e) => setPekerjaanIbu(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
              <button
                onClick={() => handleCloseModalEditWalMur()}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                Batalkan
              </button>

              <button
                disabled={!isFormValid || update.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isFormValid || update.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}
                onClick={handleSave} >

                {update.isPending
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openModalEditEmail && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Ubah Email
              </h2>

              <button
                onClick={handleCloseModalEditEmail}
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
                  Email saat ini
                </label>

                <input
                  type="text"
                  value={emailLama}
                  disabled
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email baru
                </label>

                <input
                  type="text"
                  value={emailBaru}
                  onChange={(e) => setEmailBaru(e.target.value)}
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
              <button
                onClick={() => handleCloseModalEditEmail()}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                Batalkan
              </button>

              <button
                disabled={!isEditFormEmailValid || updateEmail.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormEmailValid || updateEmail.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}
                onClick={handleSaveEmail} >

                {updateEmail.isPending
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {openModalEditPassword && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Ubah Password
              </h2>

              <button
                onClick={handleCloseModalEditPassword}
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
                  Password Lama
                </label>

                <div className="relative">
                  <input
                    type={showPasswordLama ? "text" : "password"}
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500"
                  />

                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    type="button"
                    onClick={() => setShowPasswordLama(!showPasswordLama)}>
                    <i
                      className={
                        showPasswordLama ? "ri-eye-line" : "ri-eye-off-line"
                      }
                      style={{ fontSize: 20 }}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password Baru
                </label>

                <div className="relative">
                  <input
                    type={showPasswordBaru ? "text" : "password"}
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500"
                  />

                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    type="button"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}>
                    <i
                      className={
                        showPasswordBaru ? "ri-eye-line" : "ri-eye-off-line"
                      }
                      style={{ fontSize: 20 }}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Konfirmasi Password Baru
                </label>

                <div className="relative">
                  <input
                    type={showPasswordKonfBaru ? "text" : "password"}
                    value={passwordKonfBaru}
                    onChange={(e) => setPasswordKonfBaru(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500"
                  />

                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    type="button"
                    onClick={() => setShowPasswordKonfBaru(!showPasswordKonfBaru)}>
                    <i
                      className={
                        showPasswordKonfBaru ? "ri-eye-line" : "ri-eye-off-line"
                      }
                      style={{ fontSize: 20 }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
              <button
                onClick={() => handleCloseModalEditPassword()}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                Batalkan
              </button>

              <button
                disabled={!isEditFormPasswordValid || updatePassword.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormPasswordValid || updatePassword.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}
                onClick={handleSavePassword} >

                {updatePassword.isPending
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
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