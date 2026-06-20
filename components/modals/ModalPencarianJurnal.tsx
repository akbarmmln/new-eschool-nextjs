'use client'

import CustomDatePicker from '@/components/common/DatePicker'
import { useState } from 'react'

type Props = {
  onClose: () => void
}

export default function ModalTambahJurnal({ onClose }: Props) {
  const [tanggalDari, setTanggalDari] = useState<Date | null>(null)
  const [tanggalSampai, setTanggalSampai] = useState<Date | null>(null)

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
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

                <div className="relative">
                  <CustomDatePicker
                    name="tanggal_dari"
                    value={tanggalDari}
                    onChange={setTanggalDari}
                    yearLength={2}
                  />
                  <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Sampai
                </label>

                <div className="relative">
                  <CustomDatePicker
                    name="tanggal_sampai"
                    value={tanggalSampai}
                    onChange={setTanggalSampai}
                    yearLength={2}
                  />
                  <i className="ri-calendar-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
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