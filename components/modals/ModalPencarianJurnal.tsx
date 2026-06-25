'use client'

import CustomDatePicker from '@/components/common/DatePicker'
import { useState, useEffect } from 'react'
import { useDropdownGuru } from "@/hooks/queryGuru";

type Props = {
  onClose: () => void;
  onSearch: (filter: {
    tanggalDari: Date | null;
    tanggalSampai: Date | null;
    guru: any
  }) => void;
}

export default function ModalTambahJurnal({ onClose, onSearch }: Props) {
  const [tanggalDari, setTanggalDari] = useState<Date | null>(null);
  const [tanggalSampai, setTanggalSampai] = useState<Date | null>(null);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedGuru, setSelectedGuru] = useState<any[]>([]);

  const {
    data: guruList = [],
    isLoading: isLoadingGuruList,
    isFetching: isFetchingGuruList,
  } = useDropdownGuru(debouncedKeyword, {
    enabled: debouncedKeyword.trim().length > 0,
  });

  const isSearchFormValid = tanggalDari !== null && tanggalSampai !== null

  useEffect(() => {
    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [keyword]);
  useEffect(() => {
    setOpen(
      keyword.trim().length > 0
    );
  }, [keyword]);

  const handleSelectGuru = (guru: any) => {
    const exists = selectedGuru.some((item) => item.id === guru.id);

    if (exists) {
      return;
    }

    setSelectedGuru(
      (prev) => [
        ...prev,
        guru,
      ]
    );

    setKeyword("");
    setOpen(false);
  };

  const handleRemoveGuru = (id: string) => {
    setSelectedGuru(
      (prev) => prev.filter((item) => item.id !== id)
    );
  };

  const handleCariJurnal = async () => {
    const ids = selectedGuru.map(item => item.id).join(',');
    onSearch({
      tanggalDari,
      tanggalSampai,
      guru: ids,
    });

    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="max-h-[95vh] w-full max-w-3xl overflow-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Pencarian Jurnal
            </h2>

            <button
              onClick={() =>
                onClose()
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
              <i
                className="ri-close-line"
                style={{ fontSize: 30 }}
              />
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div className="time-grid">
              <div className="form-group">
                <label>
                  Dari
                </label>

                <div className="relative mt-2">
                  <CustomDatePicker
                    name="tanggal_dari"
                    value={tanggalDari}
                    onChange={setTanggalDari}
                    yearLength={2}
                    maxDate={tanggalSampai ?? undefined}
                  />
                  <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Sampai
                </label>

                <div className="relative mt-2">
                  <CustomDatePicker
                    name="tanggal_sampai"
                    value={tanggalSampai}
                    onChange={setTanggalSampai}
                    yearLength={2}
                    minDate={tanggalDari ?? undefined}
                  />
                  <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label>
                Guru Pengajar
              </label>

              <div className="relative mt-2">
                {/* Selected Guru */}
                {selectedGuru.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedGuru.map(
                      (guru) => (
                        <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                          key={guru.id} >
                          <span>
                            {guru.niy} - {guru.nama}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveGuru(guru.id)} >
                            <i className="ri-close-line" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Search Input */}
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(
                      e.target.value
                    )
                  }
                  placeholder="Cari guru pengajar..."
                  className="h-[48px] w-full rounded-xl border border-slate-200 px-5 text-sm outline-none transition focus:border-blue-500"
                />

                {/* Dropdown */}
                {open && (
                  <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {isLoadingGuruList || isFetchingGuruList ? (
                      <div className="px-5 py-4 text-slate-500">
                        Mencari data...
                      </div>
                    ) : guruList.length > 0 ? (
                      guruList.filter((guru: any) => !selectedGuru.some((x) => x.id === guru.id))
                        .map((guru: any) => (
                          <button className="w-full border-b border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50"
                            key={guru.id}
                            type="button"
                            onClick={() => handleSelectGuru(guru)} >
                            <div className="font-semibold text-slate-800">
                              {guru.nama}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              {guru.niy}
                            </div>
                          </button>
                        )
                      )
                    ) : (
                      <div className="px-5 py-4 text-center text-slate-500">
                        Data guru tidak ditemukan
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* {isLoading || isFetching ? (
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-slate-800">
                      Gagal Memuat Data Guru
                    </h3>

                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      Terjadi kesalahan saat mengambil data guru pengajar.
                      Silakan periksa koneksi internet Anda atau coba lagi beberapa saat.
                    </p>

                    <button
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
                      type="button"
                      onClick={() => refetch()} >
                      <i className="ri-refresh-line" />
                      <span>Coba Lagi</span>
                    </button>
                  </div>
                </div>
            ) : (
              <div className="mt-6">
                <label>
                  Pilih Guru Pengajar
                </label>

                <div className="relative mt-2">
                  <MultiSelectGuru
                    options={guruOptions}
                    selected={guruPengajar}
                    onChange={setGuruPengajar}
                    namaLabel="Pilih guru pengajar..."
                  />
                </div>
              </div>
            )} */}
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 rounded-b-3xl">
            <button
              onClick={() =>
                onClose()
              }

              className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
              Batalkan
            </button>

            <button
              onClick={handleCariJurnal}
              disabled={!isSearchFormValid}
              className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition bg-blue-600 shadow-blue-500/20 hover:bg-blue-700
                ${!isSearchFormValid ? "cursor-not-allowed bg-slate-400 shadow-none" : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"}
              `} >
              Cari Jurnal
            </button>
          </div>
        </div>
      </div>

      <style jsx>
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

          .time-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }

          @media (min-width: 768px) {
            .time-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}
      </style>
    </>
  )
}