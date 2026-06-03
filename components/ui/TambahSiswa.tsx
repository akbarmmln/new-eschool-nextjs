"use client";

import { useState } from "react";
import CustomDatePicker from '@/components/common/DatePicker'
import { useRouter } from "next/navigation";
import isEmpty from "@/utils/isEmpty";
import { useSearchEmailWalMur } from "@/hooks/querySiswa";

export default function TambahSiswa() {
  const router = useRouter();
  const [nik, setNik] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null)
  const [alamatLengkap, setAlamatLengkap] = useState('')
  const [noRT, setNoRT] = useState('')
  const [noRW, setNoRW] = useState('')
  const [kelurahan, setKelurahan] = useState('')
  const [kecamatan, setKecamatan] = useState('')

  const [emailPencarian, setEmailPencarian] = useState('')
  const [isWalMurFound, setIsWalMurFound] = useState(true);

  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');

  const isPencarianFormValid = !isEmpty(emailPencarian);

  const isFormValid =
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
    !isEmpty(namaIbu);

  const searchEmailWalMur = useSearchEmailWalMur();

  const handlePencarianWalMur = async () => {
    try {
      const data = await searchEmailWalMur.mutateAsync({ search: emailPencarian });
      if (!data) {
        setNamaAyah('')
        setNamaIbu('')

        setIsWalMurFound(false);
      } else {
        setNamaAyah(data.nama_ayah || '')
        setNamaIbu(data.nama_ibu || '')

        setIsWalMurFound(true);
      }
    } catch (e) {
      setNamaAyah('')
      setNamaIbu('')

      setIsWalMurFound(false);
    }
  }

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

        <div className="min-h-screen bg-slate-50 md-6">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* DATA PRIBADI SISWA */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Data Pribadi Siswa
                </h2>
              </div>

              <div className="p-6">
                <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      Foto Profil Siswa
                    </label>

                    <div className="flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100">
                      <i className="ri-camera-line text-slate-400" style={{ fontSize: 50 }}/>

                      <p className="mt-4 text-center text-xs text-slate-500">
                        Klik atau seret foto ke sini
                        <br />
                        (Format JPG/PNG)
                      </p>
                    </div>

                    <p className="mt-2 text-xs italic text-slate-400">
                      Ukuran maksimal: 2MB
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        NIK (Nomor Induk Kependudukan)
                      </label>

                      <input
                        type="text"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        placeholder="Masukkan 16 digit NIK"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-500"
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
                        placeholder="Nama sesuai ijazah/akta"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-500"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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

                      <div className="form-group">
                        <label className="block text-sm font-semibold text-slate-700">
                          Tanggal Lahir
                        </label>

                        <div className="input-icon mt-3">
                          <CustomDatePicker
                            name="tanggal_lahir"
                            value={tanggalLahir}
                            onChange={setTanggalLahir}
                            yearLength={60}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ALAMAT + ORANG TUA */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Alamat Domisili
                  </h2>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Alamat/Nama Jalan
                    </label>

                    <input
                      type="text"
                      value={alamatLengkap}
                      onChange={(e) => setAlamatLengkap(e.target.value)}
                      placeholder="Jl. Contoh No. 123"
                      className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        RT
                      </label>

                      <input
                        type="text"
                        value={noRT}
                        onChange={(e) => setNoRT(e.target.value)}
                        placeholder="000"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        RW
                      </label>

                      <input
                        type="text"
                        value={noRW}
                        onChange={(e) => setNoRW(e.target.value)}
                        placeholder="000"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Kelurahan
                      </label>

                      <input
                        type="text"
                        value={kelurahan}
                        onChange={(e) => setKelurahan(e.target.value)}
                        placeholder="Nama Kelurahan"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Kecamatan
                      </label>

                      <input
                        type="text"
                        value={kecamatan}
                        onChange={(e) => setKecamatan(e.target.value)}
                        placeholder="Nama Kecamatan"
                        className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Data Orang Tua
                  </h2>
                </div>

                <div className="space-y-6 p-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500"
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
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                          className={`h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500
                            ${
                            isWalMurFound
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                              : "border-slate-300 focus:border-blue-500"
                            }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                          className={`h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500
                            ${
                            isWalMurFound
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

              {/* <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Data Orang Tua
                  </h2>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nama Ayah
                    </label>

                    <div className="relative">
                      <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Nama Lengkap Ayah"
                        className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nama Ibu
                    </label>

                    <div className="relative">
                      <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Nama Lengkap Ibu"
                        className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        No. Telepon Orang Tua
                      </label>

                      <div className="relative">
                        <i className="ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="08XXXXXXXXXX"
                          className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                       Email Aktif
                      </label>

                      <div className="relative">
                        <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          placeholder="example@email.com"
                          className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-blue-500"
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
              </div> */}
            </div>

            {/* ACTION */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="h-12 rounded-xl border border-slate-300 px-6 font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => router.push("/akademik/siswa")} >
                Batal
              </button>

              <button 
                disabled={!isFormValid}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isFormValid
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}>
                    
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}