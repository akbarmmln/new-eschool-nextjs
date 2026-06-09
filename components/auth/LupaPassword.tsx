"use client";

import Link from "next/link";
import { useState } from "react";
import isEmpty from "@/utils/isEmpty";

export default function LupaPassword() {
  const [email, setEmail] = useState("");

  const isFormValid = !isEmpty(email);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-2xl font-bold text-slate-800">
          Lupa Password?
        </h1>

        <p className="mb-8 text-base leading-relaxed text-slate-500">
          Jika Anda lupa kata sandi Anda, kami akan mengirimkan petunjuk
          melalui email untuk mengatur ulang kata sandi Anda.
        </p>

        <div className="mb-6">
          <label className="mb-3 block text-base font-medium text-slate-700">
            Alamat Email
          </label>

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder=""
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-base outline-none transition focus:border-blue-500"
            />

            <i className="ri-mail-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500" />
          </div>
        </div>

        <button 
          disabled={!isFormValid}
          className={`h-12 w-full rounded-lg bg-indigo-400 text-base font-medium text-white transition 
          ${!isFormValid 
            ?  'cursor-not-allowed bg-slate-400 shadow-none'
            : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
          }`}>
          Lanjutkan
        </button>

        <div className="mt-6 text-center">
          <span className="text-base text-slate-600">
            Kembali ke{" "}
          </span>

          <Link href="/akademik/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}