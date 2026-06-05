"use client";

import { useState } from "react";
import { useProfile, useUpdateIpAndIa, useUpdateEmail, useUpdatePassword } from '@/hooks/query'
import { formatTanggalIndonesia } from "@/utils/utils";
import CustomDatePicker from '@/components/common/DatePicker'
import isEmpty from "@/utils/isEmpty";
import { showAlert } from "@/utils/swal";
import dayjs from 'dayjs'

export default function ProfileSayaDS1() {
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfile()
  const [openModalEditIP, setOpenModalEditIP] = useState(false);
  const [openModalEditIA, setOpenModalEditIA] = useState(false);
  const [openModalEditEmail, setOpenModalEditEmail] = useState(false);
  const [openModalEditPassword, setOpenModalEditPassword] = useState(false);

  const [namaLengkap, setNamaLengkap] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null)
  const [pendidikan, setPendidikan] = useState('')
  const [nomorTelepon, setNomorTelepon] = useState('')

  const [alamat, setAlamat] = useState('')
  const [noRT, setNoRT] = useState('')
  const [noRW, setNoRW] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [kelurahan, setKelurahan] = useState('')

  const [email, setEmail] = useState('')
  const [passwordLama, setPasswordLama] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [passwordKonfBaru, setPasswordKonfBaru] = useState('')

  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showPasswordKonfBaru, setShowPasswordKonfBaru] = useState(false);

  const isEditFormIPValid =
    !isEmpty(namaLengkap) &&
    !isEmpty(jenisKelamin) &&
    tanggalLahir !== null &&
    !isEmpty(pendidikan) &&
    !isEmpty(nomorTelepon);

  const isEditFormIAValid =
    !isEmpty(alamat) &&
    !isEmpty(noRT) &&
    !isEmpty(noRW) &&
    !isEmpty(kecamatan) &&
    !isEmpty(kelurahan);

  const isEditFormEmailValid = !isEmpty(email)
  const isEditFormPasswordValid =
    !isEmpty(passwordLama) &&
    !isEmpty(passwordBaru) &&
    !isEmpty(passwordKonfBaru);

  const updateIP = useUpdateIpAndIa();
  const handleOpenModalEditIP = () => {
    const nama = data?.nama || "";
    const jk = data?.jenis_kelamin || "";
    const tgl = data?.tanggal_lahir ? new Date(data.tanggal_lahir) : null;
    const pendidikan = data?.pendidikan || "";
    const hp = data?.nomor_handphone || "";

    setNamaLengkap(nama);
    setJenisKelamin(jk);
    setTanggalLahir(tgl);
    setPendidikan(pendidikan);
    setNomorTelepon(hp);

    setOpenModalEditIP(true);
  };
  const handleCloseModalEditIP = () => {
    setNamaLengkap("");
    setJenisKelamin("");
    setTanggalLahir(null);
    setPendidikan("");
    setNomorTelepon("");
    setOpenModalEditIP(false);
  };
  const handleSaveInformasiPribadi = async () => {
    try {
      const payload = {
        id: data?.id,
        object_update: {
          nama: namaLengkap,
          tanggal_lahir: dayjs(tanggalLahir).format('YYYY-MM-DD'),
          pendidikan: pendidikan,
          jenis_kelamin: jenisKelamin,
          nomor_handphone: nomorTelepon,
        }
      };

      const hasil = await updateIP.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi pribadi berhasil diperbaharui"
      );

      handleCloseModalEditIP();

      await refetch();
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data informasi pribadi`,
      );
    }
  }

  const updateIA = useUpdateIpAndIa();
  const handleOpenModalEditIA = () => {
    setAlamat(data?.alamat || '');
    setNoRT(data?.rt || '');
    setNoRW(data?.rw || '');
    setKecamatan(data?.kecamatan || '');
    setKelurahan(data?.kelurahan || '');

    setOpenModalEditIA(true);
  }
  const handleCloseModalEditIA = () => {
    setAlamat('');
    setNoRT('');
    setNoRW('');
    setKecamatan('');
    setKelurahan('');

    setOpenModalEditIA(false);
  };
  const handleSaveInformasiAlamat = async () => {
    try {
      const payload = {
        id: data?.id,
        object_update: {
          alamat: alamat,
          rt: noRT,
          rw: noRW,
          kelurahan: kelurahan,
          kecamatan: kecamatan
        }
      };

      const hasil = await updateIA.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi alamat berhasil diperbaharui"
      );

      handleCloseModalEditIA();

      await refetch();
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data informasi alamat`,
      );
    }
  }

  const updateEmail = useUpdateEmail();
  const handleOpenModalEditEmail = () => {
    setEmail('')
    setOpenModalEditEmail(true);
  }
  const handleCloseModalEditEmail = () => {
    setEmail('')
    setOpenModalEditEmail(false);
  }
  const handleSaveEmail = async () => {
    try {
      const payload = {
        email_baru: email
      };

      const hasil = await updateEmail.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data email berhasil diperbaharui"
      );

      handleCloseModalEditEmail();

      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui email: ${e.err_msg}`,
      );
    }
  }

  const updatePassword = useUpdatePassword();
  const handleOpenModalEditPassword = () => {
    setPasswordLama('')
    setPasswordBaru('')
    setPasswordKonfBaru('')
    setOpenModalEditPassword(true);
  }
  const handleCloseModalEditPassword = () => {
    setPasswordLama('')
    setPasswordBaru('')
    setPasswordKonfBaru('')
    setOpenModalEditPassword(false);
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
          "Gagal",
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

      await refetch();
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
                    Informasi Pribadi
                  </h2>

                  <button onClick={handleOpenModalEditIP}
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
                        className="ri-id-card-line"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="NIY"
                    value={!isEmpty(data?.niy) ? data?.niy : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ri-calendar-line"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Tanggal Lahir"
                    value={!isEmpty(data?.tanggal_lahir) ? formatTanggalIndonesia(data?.tanggal_lahir) : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ri-user-line"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Nama Lengkap"
                    value={!isEmpty(data?.nama) ? data?.nama : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-friends"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Jenis Kelamin"
                    value={
                      data?.jenis_kelamin === "L"
                        ? "Laki-Laki"
                        : data?.jenis_kelamin === "P"
                          ? "Perempuan"
                          : "-"
                    }
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-school"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Pendidikan"
                    value={!isEmpty(data?.pendidikan) ? data?.pendidikan : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-phone"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Nomor Telepon"
                    value={!isEmpty(data?.nomor_handphone) ? data?.nomor_handphone : '-'}
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
            <>
              <div className="border-b border-slate-250 px-6 py-4 dark:border-slate-100 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-slate-800 dark:text-white">
                    Informasi Alamat
                  </h2>

                  <button onClick={handleOpenModalEditIA}
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
                        className="ti ti-map-2"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Alamat / Nama Jalan"
                    value={!isEmpty(data?.alamat) ? data?.alamat : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-home-link"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="RT / RW"
                    value={`${!isEmpty(data?.rt) ? data?.rt : '-'} / ${!isEmpty(data?.rw) ? data?.rw : '-'}`}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-layout-distribute-horizontal"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Kecamatan"
                    value={!isEmpty(data?.kecamatan) ? data?.kecamatan : '-'}
                  />

                  <DetailItem
                    icon={
                      <i
                        className="ti ti-layout-distribute-horizontal"
                        style={{ fontSize: 22 }}
                      />
                    }
                    title="Kelurahan"
                    value={!isEmpty(data?.kelurahan) ? data?.kelurahan : '-'}
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
            <div className="border-b border-slate-250 px-6 py-4 dark:border-slate-100 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Email
                </h2>

                <button onClick={handleOpenModalEditEmail}
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
            <div className="border-b border-slate-250 px-6 py-4 dark:border-slate-100 dark:bg-slate-900">
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
      </div>

      {openModalEditIP && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Informasi Pribadi
                </h2>

                <button
                  onClick={handleCloseModalEditIP}
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
                    value={data?.niy || ""}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Jenis Kelamin
                  </label>

                  <div className="input-icon mt-2">
                    <select value={jenisKelamin || ""}
                      onChange={(e) =>
                        setJenisKelamin(e.target.value)
                      } >
                      <option value="">
                        Pilih Jenis Kelamin
                      </option>
                      <option value="L">
                        Laki-Laki
                      </option>
                      <option value="P">
                        Perempuan
                      </option>
                    </select>
                    <i className="ri-arrow-down-s-line" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tanggal Lahir
                  </label>
                  
                  <div className="relative">
                    <CustomDatePicker
                      name="tanggal_lahir"
                      value={tanggalLahir}
                      onChange={setTanggalLahir}
                      yearLength={60}
                    />
                    <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Pendidikan
                  </label>

                  <input
                    type="text"
                    value={pendidikan}
                    onChange={(e) => setPendidikan(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nomor Telepon
                  </label>

                  <input
                    type="text"
                    value={nomorTelepon}
                    onChange={(e) => setNomorTelepon(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
                <button
                  onClick={() => handleCloseModalEditIP()}
                  className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                  Batalkan
                </button>

                <button
                  disabled={!isEditFormIPValid || updateIP.isPending}
                  className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormIPValid || updateIP.isPending
                      ? "cursor-not-allowed bg-slate-400 shadow-none"
                      : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                    }`}
                  onClick={handleSaveInformasiPribadi} >

                  {updateIP.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {openModalEditIA && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Informasi Alamat
                </h2>

                <button
                  onClick={handleCloseModalEditIA}
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
                    Alamat / Nama Jalan
                  </label>

                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div className="time-grid">
                  <div className="form-group">
                    <label>
                      Nomor RT
                    </label>

                    <div className="input-icon">
                      <input
                        type="text"
                        value={noRT}
                        onChange={(e) =>
                          setNoRT(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Nomor RW
                    </label>

                    <div className="input-icon">
                      <input
                        type="text"
                        value={noRW}
                        onChange={(e) =>
                          setNoRW(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="time-grid">
                  <div className="form-group">
                    <label>
                      Kecamatan
                    </label>

                    <div className="input-icon">
                      <input
                        type="text"
                        value={kecamatan}
                        onChange={(e) =>
                          setKecamatan(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Kelurahan
                    </label>

                    <div className="input-icon">
                      <input
                        type="text"
                        value={kelurahan}
                        onChange={(e) =>
                          setKelurahan(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
                <button
                  onClick={() => handleCloseModalEditIA()}
                  className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                  Batalkan
                </button>

                <button
                  disabled={!isEditFormIAValid || updateIA.isPending}
                  className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormIAValid || updateIA.isPending
                      ? "cursor-not-allowed bg-slate-400 shadow-none"
                      : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                    }`}
                  onClick={handleSaveInformasiAlamat} >

                  {updateIA.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
          <style jsx>
            {`
              .time-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
              }
            `}
          </style>
        </>
      )}

      {openModalEditEmail && (
        <>
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
                    value={data?.email || ""}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
        </>
      )}

      {openModalEditPassword && (
        <>
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
        </>
      )}
    </>
  );
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
