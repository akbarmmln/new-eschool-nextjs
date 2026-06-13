"use client";

import { useEffect, useState } from "react";
import CustomDatePicker from '@/components/common/DatePicker'
import { useRouter } from "next/navigation";
import isEmpty from "@/utils/isEmpty";
import { useSearchEmailWalMur, useCreate } from "@/hooks/querySiswa";
import { useDropdownKelas, useSearchKelas } from "@/hooks/queryKelas";
import { useGetWilayahByKodePos } from "@/hooks/queryAlamat";
import { useAccessContext } from '@/context/AccessContext'
import { allowPage } from "@/utils/utils";
import { compressImage, fileToBase64 } from "@/utils/utils";
import dayjs from 'dayjs'
import { showAlert } from "@/utils/swal";
import { useQueryClient } from '@tanstack/react-query';

export default function TambahSiswa() {
  const router = useRouter();
  const allow_tipe = ['DS1'];
  const allow_role = ['0', '1', '9'];
  const queryClient = useQueryClient();

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

  const {
    data: dataKelas,
    isLoading: isLoadingKelas,
    isFetching: isFetchingKelas
  } = useDropdownKelas({
    enabled: true,
  });

  const [kodePos, setKodePos] = useState("");
  const [openModalAlamat, setOpenModalAlamat] = useState(false);

  const [fotoSiswa, setFotoSiswa] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [nik, setNik] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null)
  const [alamatLengkap, setAlamatLengkap] = useState('')
  const [noRT, setNoRT] = useState('')
  const [noRW, setNoRW] = useState('')
  const [kelurahan, setKelurahan] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [wilayah, setWilayah] = useState('')
  const [wilayahTerpilih, setWilayahTerpilih] = useState('')

  const [emailPencarian, setEmailPencarian] = useState('')
  const [isWalMurFound, setIsWalMurFound] = useState(true);

  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [emailValid, setEmailValid] = useState('')

  const [kelasIdChoose, setKelasIdChoose] = useState('')
  const [kelasChoose, setKelasChoose] = useState('')
  const [wakiKelasChoose, setWakiKelasChoose] = useState('')
  const [ruangkelasChoose, setRuangkelasChoose] = useState('')
  const [jumlahsiswaChoose, setJumlahsiswaChoose] = useState('')
  const [tingkatKelasChoose, setTingkatKelasChoose] = useState('')
  const [fillDropDownWilayah, setFillDropDownWilayah] = useState<[] | null>(null)

  const isPencarianFormValid = !isEmpty(emailPencarian);
  const isPilihWilayahFormValid = !isEmpty(wilayah);
  const isKodePosFormValid = !isEmpty(kodePos);

  const isFormValid =
    !isEmpty(kelasIdChoose) &&
    !isEmpty(nik) &&
    !isEmpty(namaLengkap) &&
    !isEmpty(jenisKelamin) &&
    tanggalLahir !== null &&
    !isEmpty(alamatLengkap) &&
    !isEmpty(noRT) &&
    !isEmpty(noRW) &&
    !isEmpty(kelurahan) &&
    !isEmpty(kecamatan) &&
    !isEmpty(namaAyah) &&
    !isEmpty(namaIbu) &&
    !isEmpty(emailValid);

  const searchEmailWalMur = useSearchEmailWalMur();
  const searchKelas = useSearchKelas();
  const create = useCreate();

  const handlePencarianWalMur = async () => {
    try {
      const data = await searchEmailWalMur.mutateAsync({ search: emailPencarian });
      if (!data) {
        setNamaAyah('')
        setNamaIbu('')
        setEmailValid(emailPencarian);

        setIsWalMurFound(false);
      } else {
        setNamaAyah(data.nama_ayah || '')
        setNamaIbu(data.nama_ibu || '')
        setEmailValid(emailPencarian);

        setIsWalMurFound(true);
      }
    } catch (e) {
      setNamaAyah('')
      setNamaIbu('')

      setIsWalMurFound(false);
    }
  }

  const handleSaveCreate = async () => {
    try {
      const payload = {
        nik: nik,
        nama_lengkap: namaLengkap,
        jenis_kelamin: jenisKelamin,
        tanggal_lahir: dayjs(tanggalLahir).format('YYYY-MM-DD'),
        alamat: alamatLengkap,
        no_rt: noRT,
        no_rw: noRW,
        kelurahan: kelurahan,
        kecamatan: kecamatan,
        id_kelas: kelasIdChoose,
        nama_ayah: namaAyah,
        nama_ibu: namaIbu,
        email_aktif: emailValid,
        ocup_ayah: '',
        ocup_ibu: '',
        image: fotoSiswa,
      }

      const hasil = await create.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data siswa baru berhasil ditambahkan"
      );

      await queryClient.invalidateQueries({
        queryKey: ['all-siswa'],
      });

      router.push('/akademik/siswa');
    } catch (e) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal menampahkan data siswa baru`,
      );
    }
  }

  const handleUploadFotoSiswa = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await processImage(file);
  };
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    await processImage(file);
  };

  const processImage = async (file: File) => {
    try {
      setIsCompressing(true);
      setCompressProgress(0);

      const compressedFile = await compressImage(
        file,
        (progress) => {
          setCompressProgress(progress);
        }
      );

      const base64 = await fileToBase64(compressedFile);

      setFotoSiswa(base64);
      setFotoPreview(`data:${compressedFile.type};base64,${base64}`);
    } finally {
      setCompressProgress(100);

      setTimeout(() => {
        setIsCompressing(false);
        setCompressProgress(0);
      }, 500);
    }
  };

  const handleChangeKelas = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const kelasChoose = e.target.value;
    const selected = dataKelas?.find(
      (item) => item.nama_kelas === kelasChoose
    );
    const kelasId = selected?.id || "";

    setKelasChoose(kelasChoose);
    setKelasIdChoose(kelasId);

    if (!isEmpty(kelasId)) {
      const data = await searchKelas.mutateAsync({ id: kelasId });
      if (data) {
        setWakiKelasChoose(data?.wali_kelas?.nama)
        setRuangkelasChoose(data?.ruang_kelas?.nama_kelas)
        setJumlahsiswaChoose(data?.dataSiswa.length)
        setTingkatKelasChoose(data?.tingkat_kelas?.nama)
      } else {
        setWakiKelasChoose("")
        setRuangkelasChoose("")
        setJumlahsiswaChoose("")
        setTingkatKelasChoose("")
      }
    } else {
      setWakiKelasChoose("")
      setRuangkelasChoose("")
      setJumlahsiswaChoose("")
      setTingkatKelasChoose("")
    }
  };

  useEffect(() => {
    if (openModalAlamat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModalAlamat]);

  const wilayahKodePos = useGetWilayahByKodePos()
  const handleOpenModalAlamat = () => {
    setKodePos('')
    setWilayah('');
    setOpenModalAlamat(true)
  }
  const handleCloseModalAlamat = () => {
    setKodePos('')
    setWilayah('');
    setOpenModalAlamat(false)
    wilayahKodePos.reset();
  }
  const handlePencarianWilayah = async () => {
    try {
      setFillDropDownWilayah([])
      const hasil: any = await wilayahKodePos.mutateAsync(kodePos)
      if (!hasil.ok) {
        throw hasil
      }
      setFillDropDownWilayah(hasil.data.data)
    } catch (e) {
      setFillDropDownWilayah([])
    }
  }
  const handleSavePilihWilayah = () => {
    const parts = wilayah.split(':');

    const alamat = {
      provinsi: parts[0] || '',
      kabupaten: parts[1] || '',
      kecamatan: parts[2] || '',
      kelurahan: parts[3] || '',
      kodePos: parts[4] || '',
    };

    setWilayahTerpilih(wilayah);

    setKelurahan(alamat.kelurahan);
    setKecamatan(alamat.kecamatan);

    handleCloseModalAlamat();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Penambahan Data Peserta Didik
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Lengkapi formulir dibawah ini untuk mendaftarkan data siswa baru ke dalam sistem</span>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-slate-50 md-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* DATA PRIBADI SISWA */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Data Pribadi Siswa
                </h2>
              </div>

              <div className="p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-white">
                      Foto Profil Siswa
                    </label>

                    <label
                      htmlFor="foto-siswa"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() =>
                        setIsDragging(false)
                      }
                      onDrop={handleDrop}
                      className={`flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition
                      ${isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                      {isCompressing ? (
                        <div className="flex h-full w-full flex-col items-center justify-center px-6">
                          <i className="ri-loader-4-line animate-spin text-5xl text-blue-600" />

                          <p className="mt-4 text-center text-sm font-medium text-slate-700">
                            Mengoptimalkan gambar...
                          </p>

                          <div className="mt-4 w-full max-w-xs rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                              style={{
                                width: `${compressProgress}%`,
                              }}
                            />
                          </div>

                          <p className="mt-3 text-xs text-slate-500">
                            {compressProgress}%
                          </p>
                        </div>
                      ) : fotoPreview ? (
                        <div className="flex h-full w-full items-center justify-center">
                          <img
                            src={fotoPreview}
                            alt="Foto Siswa"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : isDragging ? (
                        <>
                          <i
                            className="ri-upload-cloud-2-line text-blue-600"
                            style={{ fontSize: 60 }}
                          />

                          <p className="mt-4 text-center text-sm font-medium text-blue-600">
                            Lepaskan file di sini
                          </p>
                        </>
                      ) : (
                        <>
                          <i
                            className="ri-camera-line text-slate-400"
                            style={{ fontSize: 50 }}
                          />

                          <p className="mt-4 text-center text-xs text-slate-500">
                            Klik atau seret foto ke sini
                            <br />
                            (Format JPG/PNG)
                          </p>
                        </>
                      )}
                    </label>
                    <input
                      id="foto-siswa"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleUploadFotoSiswa}
                      disabled={isCompressing}
                    />

                    <p className="mt-2 text-xs italic text-slate-400">
                      Gambar akan dikompres otomatis untuk mengoptimalkan ukuran file.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                        NIK (Nomor Induk Kependudukan)
                      </label>

                      <input
                        type="number"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="Masukkan 16 digit NIK"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Nama sesuai ijazah/akta"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="form-group dark:text-white">
                        <label>
                          Jenis Kelamin
                        </label>

                        <div className="relative mt-2">
                          <select
                            value={jenisKelamin || ""}
                            onChange={(e) => setJenisKelamin(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 outline-none transition appearance-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
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

                          <i className="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        </div>
                      </div>

                      <div className="form-group dark:text-white">
                        <label>
                          Tanggal Lahir
                        </label>

                        <div className="relative mt-2">
                          <CustomDatePicker
                            name="tanggal_lahir"
                            value={tanggalLahir}
                            onChange={setTanggalLahir}
                            yearLength={60}
                            isDarkModeAllowed={true}
                          />

                          <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DATA Ruang Kelas */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Informasi Kelas
                </h2>
              </div>
              
              <div className="p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* PILIH KELAS */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pilih Kelas
                      </label>

                      {isLoadingKelas || isFetchingKelas ? (
                        <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                      ) : (
                        <>
                          <div className="relative">
                            <select 
                              value={kelasChoose}
                              onChange={handleChangeKelas}
                              className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 pr-12 text-base text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none">
                              <option value="">
                                Pilih kelas siswa...
                              </option>

                              {
                                dataKelas?.map((item) => (
                                  <option key={item.id} value={item.nama_kelas} >
                                    {item.nama_kelas}
                                  </option>
                                ))
                              }
                            </select>

                            <i className="ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500" />
                          </div>
                        </>
                      )}

                      <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">
                        Pilih kelas untuk melihat detail informasi kelas.
                      </p>
                      <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">
                        Pastikan kelas yang dipilih sesuai dengan siswa yang bersangkutan. Perubahan informasi kelas dapat dilakukan di menu perubahan data siswa
                      </p>
                    </div>

                    {/* DETAIL KELAS */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                      <h3 className="mb-5 text-lg font-bold text-slate-500 dark:text-white">
                        DETAIL KELAS
                      </h3>

                      <div className="grid grid-cols-2 gap-y-5">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Wali Kelas
                          </p>

                          <p className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                            {searchKelas.isPending ? (
                              <>Menunggu data...</>
                            ) : (
                              <>
                                {wakiKelasChoose || '-'}
                              </>
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Jumlah Siswa
                          </p>

                          <p className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                            {searchKelas.isPending ? (
                              <>Menunggu data...</>
                            ) : (
                              <>
                                {jumlahsiswaChoose || 0} Siswa
                              </>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Ruang
                          </p>

                          <p className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                            {searchKelas.isPending ? (
                              <>Menunggu data...</>
                            ) : (
                              <>
                                {ruangkelasChoose || '-'}
                              </>
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Tinhkat Kelas
                          </p>

                          <p className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                            {searchKelas.isPending ? (
                              <>Menunggu data...</>
                            ) : (
                              <>
                                {tingkatKelasChoose || '-'}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ALAMAT + ORANG TUA*/}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Alamat Domisili
                  </h2>
                </div>
                <div className="flex-1 p-6 dark:bg-slate-900">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                        Nama Jalan, Gedung, No. Rumah
                      </label>

                      <input
                        type="text"
                        value={alamatLengkap}
                        onChange={(e) => setAlamatLengkap(e.target.value)}
                        placeholder="Jl. Contoh No. 123"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                          RT
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={3}
                          value={noRT}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setNoRT(value);
                          }}
                          placeholder="000"
                          className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                          RW
                        </label>

                        <input
                          type="text"
                          value={noRW}
                          inputMode="numeric"
                          maxLength={3}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setNoRW(value);
                          }}
                          placeholder="000"
                          className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    
                    <button className="mt-8 flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-5 py-3 text-left transition hover:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
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

                                <div className="mt-1 flex flex-col text-sm font-medium text-slate-800 dark:text-white">
                                  <span>{alamat.provinsi}</span>
                                  <span>{alamat.kabupaten}</span>
                                  <span>{alamat.kecamatan}</span>
                                  <span>{alamat.kelurahan}</span>
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
                                      value={kodePos}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setKodePos(value);
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
                </div>
              </div>

              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Data Orang Tua
                  </h2>
                </div>
                
                <div className="p-6 dark:border-slate-800 dark:bg-slate-900">
                  <div className="space-y-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-70 dark:text-white">
                      Email Aktif
                    </label>

                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="email"
                          value={emailPencarian}
                          onChange={(e) => setEmailPencarian(e.target.value)}
                          placeholder="example@mail.com"
                          className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                        />
                      </div>

                      <button
                        disabled={!isPencarianFormValid || searchEmailWalMur.isPending}
                        className={`h-12 rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50
                        ${!isPencarianFormValid || searchEmailWalMur.isPending
                            ? "cursor-not-allowed bg-slate-400 shadow-none"
                            : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                          }`}
                        onClick={handlePencarianWalMur}
                        type="button">

                        {searchEmailWalMur.isPending
                          ? "Mencari..."
                          : "Cari"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                          Nama Ayah
                        </label>

                        <div className="relative">
                          <i className="ti ti-man absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                          <input
                            type="text"
                            placeholder="Nama Lengkap Ayah"
                            readOnly={isWalMurFound}
                            value={namaAyah}
                            onChange={(e) => setNamaAyah(e.target.value)}
                            className={`h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400
                            ${isWalMurFound
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                                : "border-slate-300 focus:border-blue-500"
                              }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                          Nama Ibu
                        </label>

                        <div className="relative">
                          <i className="ti ti-woman absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                          <input
                            type="text"
                            placeholder="Nama Lengkap Ibu"
                            readOnly={isWalMurFound}
                            value={namaIbu}
                            onChange={(e) => setNamaIbu(e.target.value)}
                            className={`h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500 outline-none transition text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400
                            ${isWalMurFound
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                                : "border-slate-300 focus:border-blue-500"
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <i className="ri-information-line text-lg text-emerald-600" />

                        <p className="text-sm text-emerald-700">
                          Pastikan alamat email yang dimasukkan masih aktif karena akan digunakan untuk proses login ke sistem aplikasi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="h-12 rounded-xl border border-slate-300 px-6 font-medium text-slate-700 hover:bg-slate-50 dark:text-white"
                onClick={() => router.push("/akademik/siswa")} >
                Batal
              </button>

              <button 
                onClick={handleSaveCreate}
                disabled={!isFormValid || isCompressing || searchKelas.isPending || create.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isFormValid || isCompressing || searchKelas.isPending || create.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}>
                    
                {create.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}