"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccessContext } from '@/context/AccessContext'
import { useGetInformasiSitus, useUpdateInformasiSitus, useUpdateLogoAndBackground } from "@/hooks/query";
import isEmpty from "@/utils/isEmpty";
import { useGetWilayahByKodePos } from "@/hooks/queryAlamat";
import { showAlert } from "@/utils/swal";
import { useQueryClient } from '@tanstack/react-query';
import { runNanoID } from "@/utils/utils";
import { fileToBase64, validateImageDimension } from "@/utils/utils";

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

  const [imageVersion, setImageVersion] = useState(Date.now());
  const [logoIni, setLogoIni] = useState("/images/logo/logo_tp_skeleton.svg");

  const [openModalEditIL, setOpenModalEditIL] = useState(false);
  const [openModalAlamat, setOpenModalAlamat] = useState(false);
  const [openModalEditVM, setOpenModalEditVM] = useState(false);

  const [openModalEditLogo, setOpenModalEditLogo] = useState(false);
  const [previewLogoBaru, setPreviewLogoBaru] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState("");

  const [namaLembaga, setNamaLembaga] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [wilayahTerpilih, setWilayahTerpilih] = useState('')
  const [kodePosPencarian, setKodePosPencarian] = useState("");
  const [wilayah, setWilayah] = useState('')
  const [fillDropDownWilayah, setFillDropDownWilayah] = useState<[] | null>(null)

  const [visi, setVisi] = useState('')
  const [misi, setMisi] = useState<any[]>([]);

  const isKodePosFormValid = !isEmpty(kodePosPencarian);
  const isPilihWilayahFormValid = !isEmpty(wilayah);

  const isValidLogoUpdate = !isEmpty(logoBase64)

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
  useEffect(() => {
    if (openModalEditVM) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditVM]);
  useEffect(() => {
    if (openModalEditLogo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalEditLogo]);
  
  useEffect(() => {
    const url = data?.settings?.logo;
    if (!url) return;
    const img = new window.Image();
    img.onload = () => {setLogoIni(url);};
    img.onerror = () => {setLogoIni("/images/error/broken-image.svg");};
    img.src = url;
  }, [data]);

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

  const updateVM = useUpdateInformasiSitus()
  const handleOpenModalEditVM = async () => {
    const visi = data?.settings?.visi || ''
    const misi = !isEmpty(data?.settings?.misi) ? JSON.parse(data?.settings?.misi) : []
    const result = await Promise.all(
      misi.map(async (item: any) => ({
        id: await runNanoID(10),
        title: item,
      }))
    );

    setVisi(visi)
    setMisi(result)
    setOpenModalEditVM(true)
  }
  const handleCloseModalEditVM = () => {
    setVisi('')
    setMisi([])
    setOpenModalEditVM(false)
  }

  const handleAddStep = async () => {
    if (misi.length >= 15) return;
    const id = await runNanoID(10);

    setMisi((prev) => [
      ...prev,
      {
        id: id,
        title: "",
      },
    ]);
  };
  const handleDeleteStep = (id: number) => {
    setMisi(prev => prev.filter(item => item.id !== id));
  };
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const newData = [...misi];

    [newData[index - 1], newData[index]] = [
      newData[index],
      newData[index - 1]
    ];

    setMisi(newData);
  };
  const handleMoveDown = (index: number) => {
    if (index === misi.length - 1) return;

    const newData = [...misi];

    [newData[index], newData[index + 1]] = [
      newData[index + 1],
      newData[index]
    ];

    setMisi(newData);
  };
  const handleChangeMisi = (id: string, value: string) => {
    setMisi((prev: any[]) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: value }
          : item
      )
    );
  };
  const handleSaveVisiMisi = async () => {
    try {
      const id = data?.settings?.id;
      const visiInput = visi;
      const misiInput = misi.filter(item => item.title?.trim()).map(item => item.title);

      const payload = {
        id: id,
        objectUpdate: {
          visi: visiInput,
          misi: JSON.stringify(misiInput)
        }
      }
      
      const hasil = await updateVM.mutateAsync(payload)
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data informasi situs berhasil diperbaharui"
      );

      handleCloseModalEditVM()

      await queryClient.invalidateQueries({
        queryKey: ['informasi-situs'],
      });
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data visi misi`,
      );
    }
  }

  const updateLogo = useUpdateLogoAndBackground();
  const handleOpenModaEditlLogo = async () => {
    setLogoBase64('')
    setPreviewLogoBaru('')
    setOpenModalEditLogo(true)
  }
  const handleCloseModalEditLogo = async () => {
    setLogoBase64('')
    setPreviewLogoBaru('')
    setOpenModalEditLogo(false)
  }
  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;
      // await validateImageDimension(file);
      await processImage(file);

    } catch (e: any) {
      setLogoBase64('')
      setPreviewLogoBaru('')

      if (e === 'err-img-2001') {
        await showAlert(
          "warning",
          "Gagal",
          "Gagal memproses Logo. Silahkan ulangi kembali"
        );
      }
      if (e === 'err-img-2002') {
        await showAlert(
          "warning",
          "Gagal",
          "Dimensi gambar harus 1024 x 1024"
        );
      }
    }
  };
  const processImage = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64}`;
      setLogoBase64(base64);
      setPreviewLogoBaru(dataUrl);
    } catch(e) {
      throw 'err-img-2001'
    }
  };
  const handleSavePerubahanLogo = async () => {
    try {
      const payload = {
        id: data?.settings?.id,
        name: 'logo',
        fileImage: logoBase64
      }

      const hasil = await updateLogo.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Logo berhasil diperbaharui"
      );

      handleCloseModalEditLogo()

      await queryClient.invalidateQueries({
        queryKey: ['informasi-situs'],
      });
      setImageVersion(Date.now());
      window.dispatchEvent(
        new CustomEvent("logo-updated")
      );
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui logo`,
      );
    }
  }

  const historyData = [
    {
      year: "1998",
      title: "Yayasan Didirikan",
      description:
        "Berawal dari inisiatif riset kecil yang fokus pada peningkatan pedagogi sekolah dasar di Asia Tenggara.",
      icon: "ri-government-line",
    },
    {
      year: "2005",
      title: "Ekspansi Nasional",
      description:
        "Menjadi jaringan jurnal dan pusat pendidikan nasional di seluruh Indonesia.",
      icon: "ri-global-line",
    },
    {
      year: "2015",
      title: "Digitalisasi Sistem",
      description:
        "Meluncurkan platform EduJournal untuk mendukung pengajaran berbasis data.",
      icon: "ri-computer-line",
    },
    {
      year: "2024",
      title: "Masa Kini",
      description:
        "Mendukung lebih dari 500 tenaga pengajar profesional aktif dengan teknologi pendidikan terkini.",
      icon: "ri-graduation-cap-line",
    },
  ];

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
              <button
                onClick={handleOpenModaEditlLogo}
                type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
              </button>

              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                {!isEmpty(data?.settings?.logo) ? (
                  <Image
                    unoptimized
                    width={250}
                    height={250}
                    src={`${logoIni}?v=${imageVersion}`}
                    alt="Logo"
                    className="opacity-100"
                  />
                ) : (
                  <Image
                    width={250}
                    height={250}
                    src="/images/error/image-add.svg"
                    alt="Logo"
                    className="opacity-100"
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-blue-500/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Logo Singkat
                  </p>
                </div>
              </label>
            </div>

            <div className="relative">
              <button 
                type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
              </button>

              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                {!isEmpty(data?.settings?.logo_panjang) ? (
                  <Image
                    unoptimized
                    width={250}
                    height={250}
                    src={data?.settings?.logo_panjang}
                    alt="Logo"
                    className="opacity-100"
                  />
                ) : (
                  <Image
                    width={250}
                    height={250}
                    src="/images/error/image-add.svg"
                    alt="Logo"
                    className="opacity-100"
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-blue-500/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Logo Panjang
                  </p>
                </div>
              </label>
            </div>

            <div className="relative">
              <button type="button" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/70 shadow-md transition hover:scale-105">
                <i className="ri-palette-line text-lg text-slate-200 dark:text-slate-200" />
              </button>

              <label className="relative flex h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                {!isEmpty(data?.settings?.background_image) ? (
                  <Image
                    unoptimized
                    width={250}
                    height={250}
                    src={data?.settings?.background_image}
                    alt="Logo"
                    className="opacity-100"
                  />
                ) : (
                  <Image
                    width={250}
                    height={250}
                    src="/images/error/image-add.svg"
                    alt="Logo"
                    className="opacity-100"
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-blue-500/70 px-4 py-3 text-center" >
                  <p className="text-sm font-semibold text-white">
                    Latar Background
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm dark:border-slate-100 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-3 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                Informasi Lembaga
              </h2>

              <button
                onClick={handleOpenEditIL}
                type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-400">
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
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-3 dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                  Visi dan Misi
                </h2>

                <button 
                  onClick={handleOpenModalEditVM}
                  type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-400">
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
                    {data?.settings?.visi || ''}
                  </p>
                </div>

                <div>
                  <div className="mb-5 flex items-center gap-3 text-teal-600">
                    <i className="ri-file-list-3-line text-3xl" />
                    <h3 className="text-xl font-bold">
                      Misi dan Nilai Inti
                    </h3>
                  </div>

                  {
                    (() => {
                      const misi = JSON.parse(data?.settings?.misi ?? "[]");
                      if (misi.length > 0) {
                        return (
                          <ul className="space-y-4 pl-8 text-xl leading-relaxed text-slate-600 text-justify dark:text-white">
                            {misi.map((item: string, index: number) => (
                              <li key={index} className="list-disc">
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })()
                  }
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-100 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-3 dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-xl font-semibold text-slate-700 md:text-xl dark:text-white">
                  Sejarah
                </h2>

                <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-base font-semibold text-teal-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-400">
                  <i className="ri-history-line text-lg dark:text-blue-500" />
                  <span className="dark:text-blue-500">Ubah</span>
                </button>
              </div>

              <div className="max-h-[700px] overflow-y-auto p-8">
                <div className="relative">
                  {/* <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700" /> */}

                  <div className="space-y-12">
                    <div className="flex min-h-[500px] flex-col items-center justify-center px-8 py-16 text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <i className="ri-history-line text-5xl text-slate-400" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        Belum Ada Riwayat Sejarah
                      </h3>

                      <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        Tambahkan perjalanan, pencapaian, dan perkembangan lembaga Anda
                        agar pengunjung dapat mengenal sejarah organisasi dengan lebih baik.
                      </p>
                    </div>

                    {/* {historyData.map((item: any, index: number) => (
                      <div key={item.year} className="relative flex gap-6">
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
                          <i className={`${item.icon} text-xl`} />
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="text-base font-bold text-teal-600">
                            {item.year}
                          </div>

                          <h3 className="mt-1 text-base font-bold text-slate-800 dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-base leading-relaxed text-justify text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </div>
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
            `}
          </style>
        </div>
      )}

      {openModalEditLogo && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="border-b border-slate-200 px-8 py-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Ubah Logo
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Logo yang bisa diterima adalah png dan ukuran dimensi 1024 x 1024
                </p>
              </div>

              <div className="p-6">
                {isEmpty(data?.settings?.logo) ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-blue-50 p-6">
                      <p className="mb-4 text-center text-sm font-semibold text-slate-500">
                        Logo Baru
                      </p>

                      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-blue-300 bg-white">
                        {previewLogoBaru ? (
                          <Image
                            src={previewLogoBaru}
                            alt="Logo Baru"
                            width={120}
                            height={120}
                            className="max-h-[120px] w-auto object-contain"
                          />
                        ) : (
                          <div className="text-center text-slate-400">
                            <i className="ri-image-add-line text-5xl" />
                            <p className="mt-2 text-sm">
                              Belum ada logo dipilih
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <p className="mb-4 text-center text-sm font-semibold text-slate-500">
                          Logo Saat Ini
                        </p>

                        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
                          <Image
                            unoptimized
                            src={`${logoIni}?v=${imageVersion}`}
                            alt="Logo Lama"
                            width={120}
                            height={120}
                            className="max-h-[120px] w-auto object-contain"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <i className="ri-arrow-right-line text-4xl" />
                        </div>
                      </div>
                      
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                        <p className="mb-4 text-center text-sm font-semibold text-slate-500">
                          Logo Baru
                        </p>

                        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-blue-300 bg-white">
                          {previewLogoBaru ? (
                            <Image
                              src={previewLogoBaru}
                              alt="Logo Baru"
                              width={120}
                              height={120}
                              className="max-h-[120px] w-auto object-contain"
                            />
                          ) : (
                            <div className="text-center text-slate-400">
                              <i className="ri-image-add-line text-5xl" />
                              <p className="mt-2 text-sm">
                                Belum ada logo dipilih
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <label className="mt-8 flex h-14 cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white transition hover:bg-slate-50">
                  <i className="ri-upload-2-line text-xl" />

                  <span className="font-medium">
                    Upload Logo Baru
                  </span>

                  <input
                    type="file"
                    accept=".png,.svg"
                    hidden
                    onChange={handleUploadLogo}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-slate-50 px-8 py-5">
                <button
                  type="button"
                  onClick={handleCloseModalEditLogo}
                  className="rounded-xl px-5 py-3 font-medium text-slate-500 transition hover:bg-slate-200">

                  Batalkan
                </button>

                <button 
                  disabled={!isValidLogoUpdate || updateLogo.isPending}
                  onClick={handleSavePerubahanLogo}
                  type="button" 
                  className={`rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-700
                    ${!isValidLogoUpdate ? 'cursor-not-allowed bg-slate-400 shadow-none' : ''}`}>
                  
                  {updateLogo.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </>
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

                  <button
                    className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-5 py-3 text-left transition hover:border-blue-500"
                    type="button"
                    onClick={handleOpenModalAlamat} >

                    <div className="flex-1">
                      {isEmpty(wilayahTerpilih) ? (
                        <span className="truncate text-slate-400">
                          Provinsi, Kota, Kecamatan, Kelurahan
                        </span>
                      ) : (
                        (() => {
                          const parts = wilayahTerpilih.split(":");

                          const alamat = {
                            provinsi: parts[0] || "",
                            kabupaten: parts[1] || "",
                            kecamatan: parts[2] || "",
                            kelurahan: parts[3] || "",
                            kodePos: parts[4] || "",
                          };

                          return (
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
                          );
                        })()
                      )}
                    </div>

                    <div className="ml-4 flex w-8 shrink-0 flex-col items-center gap-2">
                      {!isEmpty(wilayahTerpilih) && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();

                            setWilayahTerpilih("");
                            setWilayah("");
                            setKodePosPencarian("");
                            setFillDropDownWilayah([]);

                            wilayahKodePos.reset();
                          }}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-blue-500 text-white shadow-sm transition hover:border-red-500 hover:bg-red-500 hover:text-white">
                          <i className="ri-close-line text-sm" />
                        </span>
                      )}

                      {isEmpty(wilayahTerpilih) && (
                        <i className="ri-arrow-right-s-line text-2xl text-slate-400" />
                      )}
                    </div>
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
                    type="number"
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

      {openModalEditVM && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Visi Misi
                </h2>

                <button
                  onClick={handleCloseModalEditVM}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                  <i
                    className="ri-close-line"
                    style={{ fontSize: 30 }}
                  />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid border-b border-slate-200 md:grid-cols-[280px_1fr]">
                  <div className="space-y-6 p-6">
                    <div className="text-lg font-medium text-slate-800">
                      VISI
                    </div>

                    <div className="space-y-3 text-slate-700">
                      <p>Deskripsikan visi dengan jelas.</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <textarea
                      value={visi}
                      onChange={(e) => {
                        setVisi(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      rows={4}
                      className="min-h-[120px] w-full max-w-md border-b border-slate-300 bg-slate-100 px-5 py-5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid border-b border-slate-200 md:grid-cols-[280px_1fr]">
                  <div className="space-y-6 p-6">
                    <div className="text-lg font-medium text-slate-800">
                      MISI
                    </div>

                    <div className="space-y-3 text-slate-700">
                      <p>
                        Deskripsikan misi dengan jelas. Maksimum yang dapat ditulis sebanyak 15 baris.
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    {misi.map((item, index) => (
                    <div key={item.id} className="border-b border-slate-200 py-4">
                      <div className="flex items-start gap-4">

                        <input value={item.title} onChange={(e) => handleChangeMisi(item.id, e.target.value)}
                          className="h-14 w-full max-w-md border-b border-slate-300 bg-slate-100 px-5 outline-none"
                          placeholder="Masukkan misi atau nilai inti..."
                        />

                        <div className="flex flex-col items-center">
                          <button type="button" onClick={()=> handleMoveUp(index)}
                            className={`transition ${index === 0 ? "cursor-not-allowed text-slate-300" : "text-slate-400 hover:text-pink-500"}`}
                            disabled={index === 0} >
                            <i className="ri-arrow-up-s-line text-2xl" />
                          </button>

                          <button type="button" onClick={()=> handleMoveDown(index)}
                            className={`transition ${index === misi.length - 1 ? "cursor-not-allowed text-slate-300" : "text-pink-500 hover:text-pink-600"}`}
                            disabled={index === misi.length - 1} >
                            <i className="ri-arrow-down-s-line text-2xl" />
                          </button>
                        </div>

                        <button className="mt-3 text-2xl text-slate-800 hover:text-red-500" type="button" onClick={()=>
                          handleDeleteStep(item.id)} >
                          <i className="ri-delete-bin-fill" />
                        </button>
                      </div>
                    </div>
                    ))}

                    <button type="button" onClick={handleAddStep}
                      className="mt-6 inline-flex items-center gap-3 font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600
                      disabled:opacity-50"
                      disabled={misi.length>= 15} >
                      <i className="ri-add-line text-xl" />
                      Tambahkan Misi/Nilai Inti Baru
                    </button>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
                <button
                  onClick={() => handleCloseModalEditVM()}
                  className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                  Batalkan
                </button>

                <button
                  className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition bg-blue-600 shadow-blue-500/20 hover:bg-blue-700`}
                  onClick={handleSaveVisiMisi}>

                  {updateVM.isPending
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