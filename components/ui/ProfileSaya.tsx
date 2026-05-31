"use client";

import { useState } from "react";
import { useProfile, useUpdateIpAndIa } from '@/hooks/query'
import { formatTanggalIndonesia } from "@/utils/utils";
import CustomDatePicker from '@/components/common/DatePicker'
import isEmpty from "@/utils/isEmpty";
import { showAlert } from "@/utils/swal";
import dayjs from 'dayjs'
import { useAccessContext } from '@/context/AccessContext'

export default function ProfileSaya() {
  const dataAccess = useAccessContext()
  console.log('sdasdasdasd', dataAccess)
  const { data, isLoading: loadingCardProfile, isFetching, refetch } = useProfile()
  const [openModalEditIP, setOpenModalEditIP] = useState(false);
  const [openModalEditIA, setOpenModalEditIA] = useState(false);

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

  const updateIP = useUpdateIpAndIa();
  const updateIA = useUpdateIpAndIa();

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

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loadingCardProfile || isFetching ? (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[...Array(6)].map((_, index) => (
                  <DetailSkeleton key={index} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 p-2 mb-4">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Informasi Pribadi
                </h2>

                <button onClick={handleOpenModalEditIP}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                  <i className="ri-edit-line" />
                  Ubah
                </button>
              </div>
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

            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {loadingCardProfile || isFetching ? (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[...Array(6)].map((_, index) => (
                  <DetailSkeleton key={index} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 p-2 mb-4">
                <h2 className="text-lg text-slate-800 dark:text-white">
                  Informasi Alamat
                </h2>

                <button onClick={handleOpenModalEditIA}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700" >
                  <i className="ri-edit-line" />
                  Ubah
                </button>
              </div>
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
            </>
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
                    ID User
                  </label>

                  <input
                    type="text"
                    value={data?.id || ""}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

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

                  <CustomDatePicker
                    name="tanggal_lahir"
                    value={tanggalLahir}
                    onChange={setTanggalLahir}
                  />
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

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
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
                    ID User
                  </label>

                  <input
                    type="text"
                    value={data?.id || ""}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

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

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
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
