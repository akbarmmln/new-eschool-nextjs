"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccessContext } from '@/context/AccessContext'
import { useGetInformasiSitus, useUpdateInformasiSitus } from "@/hooks/query";
import isEmpty from "@/utils/isEmpty";
import { useGetWilayahByKodePos } from "@/hooks/queryAlamat";
import { showAlert } from "@/utils/swal";
import { useQueryClient } from '@tanstack/react-query';

export default function PengaturanSitus() {
  const dataAccess = useAccessContext()
  const tipe_account = dataAccess?.access?.tipe_account || '';
  const role = dataAccess?.access?.role || '';
  const jabatan = dataAccess?.access?.jabatan || '';
  const queryClient = useQueryClient();

  if (!(tipe_account == 'DS1' && (role == '9' || jabatan == 'principal'))) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-red-600">
        Maaf Anda tidak bisa mengakses halaman ini
      </div>
    );
  }

  const { data, isLoading, error, isFetching, refetch } = useGetInformasiSitus();
  
  const [openModalEditIL, setOpenModalEditIL] = useState(false);
  const [openModalAlamat, setOpenModalAlamat] = useState(false);
  const [namaLembaga, setNamaLembaga] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [wilayahTerpilih, setWilayahTerpilih] = useState('')
  const [kodePosPencarian, setKodePosPencarian] = useState("");
  const [wilayah, setWilayah] = useState('')
  const [fillDropDownWilayah, setFillDropDownWilayah] = useState<[] | null>(null)

  const isKodePosFormValid = !isEmpty(kodePosPencarian);
  const isPilihWilayahFormValid = !isEmpty(wilayah);

  useEffect(() => {
    if (openModalEditIL) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditIL]);
  
  const handleOpenEditIL = () => {
    if (data) {
      const provinsi = data.settings.provinsi || '';
      const kotakab = data.settings.kota_kab  || '';
      const kecamatan = data.settings.kecamatan  || '';
      const kelurahan = data.settings.kelurahan  || '';
      const kode_pos = data.settings.kode_pos  || '';

      setNamaLembaga(data?.settings?.nama_yayasan || '')
      setAlamat(data?.settings?.alamat || '')
      setEmail(data?.settings?.alamat_email || '')
      setNomorTelepon(data?.settings?.nomor_telepon || '')
      if (provinsi && kotakab && kecamatan && kelurahan && kode_pos) {
        setWilayahTerpilih(`${provinsi}:${kotakab}:${kecamatan}:${kelurahan}:${kode_pos}`)
      } else {
        setWilayahTerpilih('')
      }
    }
    setOpenModalEditIL(true)
  }
  const handleCloseEditIL = () => {
    setNamaLembaga('')
    setAlamat('')
    setEmail('')
    setNomorTelepon('')
    setOpenModalEditIL(false)
  }

  const wilayahKodePos = useGetWilayahByKodePos()
  const handleOpenModalAlamat = () => {
    setKodePosPencarian('')
    setWilayah('');
    setOpenModalAlamat(true)
  }
  const handleCloseModalAlamat = () => {
    setKodePosPencarian('')
    setWilayah('');
    setOpenModalAlamat(false)
    wilayahKodePos.reset();
  }
  const handlePencarianWilayah = async () => {
    try {
      setFillDropDownWilayah([])
      const hasil: any = await wilayahKodePos.mutateAsync(kodePosPencarian)
      if (!hasil.ok) {
        throw hasil
      }
      setFillDropDownWilayah(hasil.data.data)
    } catch (e) {
      setFillDropDownWilayah([])
    }
  }
  const handleSavePilihWilayah = () => {
    setWilayahTerpilih(wilayah);
    handleCloseModalAlamat();
  };

  const updateIL = useUpdateInformasiSitus()
  const handleSaveIL = async () => {
    try {
      const parts = wilayahTerpilih.split(':');
      const alamatParts = {
        provinsi: parts[0] || '',
        kabupaten: parts[1] || '',
        kecamatan: parts[2] || '',
        kelurahan: parts[3] || '',
        kodePos: parts[4] || '',
      };
      const payload = {
        id: data?.settings?.id,
        objectUpdate: {
          nama_yayasan: namaLembaga,
          alamat: alamat,
          provinsi: alamatParts.provinsi,
          kota_kab: alamatParts.kabupaten,
          kecamatan: alamatParts.kecamatan,
          kelurahan: alamatParts.kelurahan,
          kode_pos: alamatParts.kodePos,
          alamat_email: email,
          nomor_telepon: nomorTelepon
        }
      }
      
      const hasil = await updateIL.mutateAsync(payload)
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi situs berhasil diperbaharui"
      );

      handleCloseEditIL()

      await queryClient.invalidateQueries({
        queryKey: ['informasi-situs'],
      });
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data informasi situs`,
      );
    }
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
              {[...Array(2)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl text-slate-800 dark:text-white">
                Pengaturan Situs
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 text-justify">
                <span>Berikan informasi tentang Lembaga Anda. Atur Nama, Logo, Latar Background, Visi Misi, dan Sejarah Pembentukan.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="relative">
              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <button type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                  <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
                </button>

                <Image
                  width={250}
                  height={250}
                  src="/images/error/broken-file.svg"
                  alt="Logo"
                  className="opacity-100"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Logo Singkat
                  </p>
                </div>
              </label>
            </div>

            <div className="relative">
              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <button type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                  <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
                </button>

                <Image
                  width={250}
                  height={250}
                  src="/images/error/broken-file.svg"
                  alt="Logo"
                  className="opacity-100"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Logo Panjang
                  </p>
                </div>
              </label>
            </div>

            <div className="relative">
              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <button type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                  <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
                </button>

                <Image
                  width={250}
                  height={250}
                  src="/images/error/broken-file.svg"
                  alt="Logo"
                  className="opacity-100"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Latar Background
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-100 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-10">
              <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                Informasi Lembaga
              </h2>

              <button 
                onClick={handleOpenEditIL}
                type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/100 dark:hover:text-blue-400">
                <i className="ri-file-edit-line text-lg dark:text-blue-500" />
                <span className="dark:text-blue-500">Ubah</span>
              </button>
            </div>

            <div className="space-y-8 px-6 py-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 xl:grid-cols-4 xl:px-10 xl:py-10">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                  NAMA
                </p>

                <h3 className="text-xl leading-relaxed text-slate-900 dark:text-white">
                  {data?.settings?.nama_yayasan || '-'}
                </h3>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                  ALAMAT
                </p>

                <p className="text-lg leading-relaxed text-slate-800 dark:text-white">
                  {(() => {
                    const alamat = data?.settings?.alamat;
                    const provinsi = data?.settings?.provinsi;
                    const kota_kab = data?.settings?.kota_kab;
                    const kecamatan = data?.settings?.kecamatan;
                    const kelurahan = data?.settings?.kelurahan;

                    if (isEmpty(alamat) && isEmpty(provinsi) && isEmpty(kota_kab) && isEmpty(kecamatan) && isEmpty(kelurahan)) {
                      return <>-</>;
                    } else if (isEmpty(alamat) && !(isEmpty(provinsi) && isEmpty(kota_kab) && isEmpty(kecamatan) && isEmpty(kelurahan))) {
                      return <>{provinsi}, {kota_kab}, {kecamatan}, {kelurahan}</>;
                    } else if (!isEmpty(alamat) && (isEmpty(provinsi) && isEmpty(kota_kab) && isEmpty(kecamatan) && isEmpty(kelurahan))) {
                      return <>{alamat}</>;
                    } else if (!isEmpty(alamat) && !(isEmpty(provinsi) && isEmpty(kota_kab) && isEmpty(kecamatan) && isEmpty(kelurahan))) {
                      return <>{alamat}, {provinsi}, {kota_kab}, {kecamatan}, {kelurahan}</>;
                    } else {
                      return <>-</>;
                    }
                  })()}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                  Email
                </p>

                <p className="break-all text-lg text-slate-800 dark:text-white">
                  {data?.settings?.alamat_email || '-'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                  Phone
                </p>

                <p className="text-lg text-slate-800 dark:text-white">
                  {data?.settings?.nomor_telepon || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2 dark:border-slate-100 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-10">
                <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                  Visi dan Misi
                </h2>

                <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/100 dark:hover:text-blue-400">
                  <i className="ri-file-edit-line text-lg dark:text-blue-500" />
                  <span className="dark:text-blue-500">Ubah</span>
                </button>
              </div>

              <div className="space-y-10 p-10">
                <div>
                  <div className="mb-5 flex items-center gap-3 text-teal-600">
                    <i className="ri-eye-line text-3xl" />
                    <h3 className="text-xl font-bold">
                      Pernyataan Visi
                    </h3>
                  </div>

                  <p className="text-xl italic leading-relaxed text-justify text-slate-600 dark:text-white">
                    "To be a leading center of educational excellence
                    that fosters innovative research and pedagogical
                    precision, empowering the next generation of
                    global thought leaders through academic integrity
                    and moral character."
                  </p>
                </div>

                <div>
                  <div className="mb-5 flex items-center gap-3 text-teal-600">
                    <i className="ri-file-list-3-line text-3xl" />
                    <h3 className="text-xl font-bold">
                      Misi dan Nilai Inti
                    </h3>
                  </div>

                  <ul className="space-y-4 pl-8 text-xl leading-relaxed text-slate-600 text-justify dark:text-white">
                    <li className="list-disc">
                      Upholding the highest standards of academic honesty
                      and transparency.
                    </li>

                    <li className="list-disc">
                      Integrating contemporary technology with classical
                      educational philosophies.
                    </li>

                    <li className="list-disc">
                      Creating an inclusive environment for reflective
                      writing and curriculum progress.
                    </li>

                    <li className="list-disc">
                      Promoting cross-disciplinary collaboration among
                      teaching professionals.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-100 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-10">
                <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                  Latar Sejarah
                </h2>

                <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/100 dark:hover:text-blue-400">
                  <i className="ri-file-edit-line text-lg dark:text-blue-500" />
                  <span className="dark:text-blue-500">Ubah</span>
                </button>
              </div>

              <div className="space-y-8 p-10 text-slate-600 dark:text-white text-justify">
                <p className="text-xl leading-relaxed">
                  Established in 1998, the Foundation began as a small research initiative focused on improving primary school pedagogy in Southeast Asia.
                </p>

                <p className="text-xl leading-relaxed">
                  Over two decades, it has evolved into a nationwide network of journals and educational centers, currently supporting over 500 active teaching professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {openModalEditIL && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Informasi Lembaga
                </h2>

                <button
                  onClick={handleCloseEditIL}
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
                    ID
                  </label>

                  <input
                    type="text"
                    value={data?.settings?.id || ""}
                    disabled
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Lembaga/Yayasan
                  </label>

                  <input
                    type="text"
                    value={namaLembaga}
                    onChange={(e) => setNamaLembaga(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Jalan, Gedung, No. Rumah
                  </label>

                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Alamat
                  </label>
                  <button className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-5 py-3 text-left transition hover:border-blue-500"
                    type="button"
                    onClick={handleOpenModalAlamat} >

                    {isEmpty(wilayahTerpilih) ? (
                      <span className="truncate text-slate-400 dark:text-slate-400">
                        Provinsi, Kota, Kecamatan, Kelurahan
                      </span>
                    ) : (
                      (() => {
                        const parts = wilayahTerpilih.split(':');
                        const alamat = {
                          provinsi: parts[0] || '',
                          kabupaten: parts[1] || '',
                          kecamatan: parts[2] || '',
                          kelurahan: parts[3] || '',
                          kodePos: parts[4] || '',
                        };
                        return <span>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400">
                              Provinsi, Kota, Kecamatan, Kelurahan
                            </span>

                            <div className="mt-1 flex flex-col text-sm font-medium text-slate-800">
                              <span>{alamat.provinsi}</span>
                              <span>{alamat.kabupaten}</span>
                              <span>{alamat.kecamatan}</span>
                              <span>{alamat.kelurahan}</span>
                              <span>{alamat.kodePos}</span>
                            </div>
                          </div>
                        </span>;
                      })()
                    )}
                    <i className="ri-arrow-right-s-line text-xl text-slate-400" />
                  </button>

                  {openModalAlamat && (
                    <>
                      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
                          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                              Lokasi Terpilih
                            </h2>

                            <button
                              onClick={handleCloseModalAlamat}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                              <i
                                className="ri-close-line"
                                style={{ fontSize: 30 }}
                              />
                            </button>
                          </div>

                          <div className="space-y-6 p-6">
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-70 dark:text-white">
                                Kode Pos
                              </label>

                              <div className="flex gap-3">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={kodePosPencarian}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, "");
                                      setKodePosPencarian(value);
                                    }}
                                    placeholder="Isi kode Pos Wilayah Anda"
                                    className="h-12 w-full rounded-xl border border-slate-300 pl-5 pr-4 outline-none focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400"
                                  />
                                </div>

                                <button
                                  disabled={!isKodePosFormValid || wilayahKodePos.isPending}
                                  className={`h-12 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50
                                      ${!isKodePosFormValid || wilayahKodePos.isPending
                                      ? "cursor-not-allowed bg-slate-400 shadow-none"
                                      : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                                    }`}
                                  onClick={handlePencarianWilayah}
                                  type="button">

                                  {wilayahKodePos.isPending
                                    ? "Mencari..."
                                    : "Cari"}
                                </button>
                              </div>
                            </div>

                            {wilayahKodePos.isIdle ? (<></>) : (
                              wilayahKodePos.isPending ? (
                                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                              ) : (
                                <div className="form-group">
                                  <div className="input-icon mt-2">
                                    <select value={wilayah || ''}
                                      onChange={(e) =>
                                        setWilayah(e.target.value)
                                      } >
                                      {fillDropDownWilayah?.length == 0 ? (
                                        <option value="">
                                          Tidak ada data
                                        </option>
                                      ) : (
                                        <>
                                          <option value="">
                                            Pilih salah satu
                                          </option>
                                          {
                                            fillDropDownWilayah?.map((item: any) => (
                                              <option key={item.id_kelurahan} value={`${item.nama_provinsi}:${item.kota_kabupaten}:${item.kecamatan}:${item.kelurahan}:${item.kodepos}`}>
                                                {`${item.nama_provinsi}, ${item.kota_kabupaten}, ${item.kecamatan}, ${item.kelurahan}, ${item.kodepos}`}
                                              </option>
                                            ))
                                          }
                                        </>
                                      )}
                                    </select>
                                    <i className="ri-arrow-down-s-line" />
                                  </div>
                                </div>
                              )
                            )}

                            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
                              <button
                                onClick={() => handleCloseModalAlamat()}
                                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                                Batalkan
                              </button>

                              <button
                                disabled={!isPilihWilayahFormValid}
                                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition bg-blue-600 shadow-blue-500/20 hover:bg-blue-700
                                  ${!isPilihWilayahFormValid
                                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                                  }`}
                                onClick={handleSavePilihWilayah} >

                                Simpan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  onClick={() => handleCloseEditIL()}
                  className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                  Batalkan
                </button>

                <button
                  className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition bg-blue-600 shadow-blue-500/20 hover:bg-blue-700`}
                  onClick={handleSaveIL} >

                  {updateIL.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
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