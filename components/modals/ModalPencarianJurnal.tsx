'use client'

type Props = {
  onClose: () => void
}

export default function ModalTambahJurnal({onClose}: Props) {
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
        </div>
      </div>
    </>
  )
}