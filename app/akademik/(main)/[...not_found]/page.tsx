'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePreviousRoute } from '@/app/providers'

export default function NotFoundSite() {
  const router = useRouter();
  const previousRoute = usePreviousRoute();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-center px-6 py-10 transition-colors duration-300">
      <div className="w-full max-w-[1100px] grid gap-10 items-center grid-cols-1 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <i className="ri-error-warning-line" />
            Error 404
          </div>

          <h1 className="m-0 font-extrabold tracking-[-3px] text-[clamp(44px,8vw,82px)] leading-none text-[#2a3547] dark:text-white">
            Oops!
          </h1>

          <h2 className="mt-4 mb-5 font-bold tracking-[-1px] text-[clamp(24px,4vw,38px)] leading-tight text-[#2a3547] dark:text-gray-100">
            Halaman tidak ditemukan
          </h2>

          <p className="max-w-[520px] mb-9 text-[17px] leading-[1.9] text-gray-500 dark:text-gray-400" >
            Halaman yang Anda cari mungkin telah dipindahkan,
            dihapus, atau URL yang dimasukkan tidak benar.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/akademik/dashboard"
              className="
                h-[52px]
                px-6
                rounded-2xl
                inline-flex
                items-center
                justify-center
                no-underline
                font-bold
                text-[15px]
                text-white
                transition-all
                duration-300
                bg-gradient-to-r
                from-[#5d87ff]
                to-[#696cff]
                shadow-[0_10px_24px_rgba(105,108,255,.25)]
                hover:scale-[1.02]
              " >
              <i className="ri-home-5-line mr-2 text-[20px]" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="
              absolute
              w-[360px]
              h-[360px]
              rounded-full
              blur-xl
              bg-[radial-gradient(circle,rgba(105,108,255,.18)_0%,rgba(105,108,255,0)_70%)]
            "
          />

          <div
            className="
              relative
              overflow-hidden
              w-full
              max-w-[420px]
              rounded-[32px]
              p-9
              border
              transition-colors
              duration-300
              bg-white/70
              border-white/60
              shadow-[0_20px_50px_rgba(0,0,0,.08)]
              dark:bg-white/[0.04]
              dark:border-white/[0.08]
              dark:shadow-[0_20px_60px_rgba(0,0,0,.45)]
              backdrop-blur-xl
            " >

            <div
              className="
                absolute
                top-[18px]
                right-[18px]
                w-[54px]
                h-[54px]
                rounded-[18px]
                flex
                items-center
                justify-center
                text-white
                text-[28px]
                bg-gradient-to-br
                from-[#5d87ff]
                to-[#696cff]
                shadow-[0_10px_25px_rgba(105,108,255,.25)]
              " >
              <i className="ri-emotion-sad-line" />
            </div>

            <div className="flex items-center justify-center mt-5 mb-7" >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="404"
                style={{
                  width: '100%',
                  maxWidth: 240,
                  objectFit: 'contain',
                }}
              />
            </div>

            <div className="text-center">
              <div
                className="
                  text-[82px]
                  font-extrabold
                  leading-none
                  tracking-[-5px]
                  bg-gradient-to-r
                  from-[#5d87ff]
                  to-[#696cff]
                  bg-clip-text
                  text-transparent
                " >
                404
              </div>

              <div
                className="
                  mt-2
                  text-[16px]
                  font-semibold
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Page Not Found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}