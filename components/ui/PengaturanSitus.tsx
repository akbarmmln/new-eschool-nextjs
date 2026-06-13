"use client";

import Image from "next/image";

export default function PengaturanSitus() {
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl text-slate-800 dark:text-white">
              Pengaturan Situs
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Berikan informasi tentang Lembaga Anda. Atur Logo, Foto Background, Visi dan Misi, dan Latar Sejarah Pembentukan</span>
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
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
              Informasi Lembaga
            </h2>

            <button type="button" className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 transition hover:text-teal-700">
              <i className="ri-file-edit-line text-lg dark:text-gray-500" />
              <span className="dark:text-gray-500">Ubah</span>
            </button>
          </div>

          <div className="space-y-8 px-6 py-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 xl:grid-cols-4 xl:px-10 xl:py-10">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                NAMA
              </p>

              <h3 className="text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
                Pendidikan Indonesia
              </h3>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                ALAMAT
              </p>

              <p className="text-lg leading-relaxed text-slate-800 dark:text-white">
                Jl. Pendidikan No. 123, Jakarta
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                Email
              </p>

              <p className="break-all text-lg text-slate-800 dark:text-white">
                contact@yayasan.id
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase text-slate-500 dark:text-white">
                Phone
              </p>

              <p className="text-lg text-slate-800 dark:text-white">
                +62 21 555 0123
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2 dark:border-slate-100 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 md:px-10">
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
                Visi dan Misi
              </h2>

              <button type="button" className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 transition hover:text-teal-700">
                <i className="ri-file-edit-line text-lg dark:text-gray-500" />
                <span className="dark:text-gray-500">Ubah</span>
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

                <ul className="space-y-4 pl-8 text-xl leading-relaxed text-slate-600 dark:text-white">
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
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
                Latar Sejarah
              </h2>

              <button type="button" className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 transition hover:text-teal-700">
                <i className="ri-file-edit-line text-lg dark:text-gray-500" />
                <span className="dark:text-gray-500">Ubah</span>
              </button>
            </div>

            <div className="space-y-8 p-10 text-slate-600 dark:text-white">
              <p className="text-xl leading-relaxed">
                Established in 1998, the Foundation began as a small
                research initiative focused on improving primary
                school pedagogy in Southeast Asia.
              </p>

              <p className="text-xl leading-relaxed">
                Over two decades, it has evolved into a nationwide
                network of journals and educational centers,
                currently supporting over 500 active teaching
                professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}