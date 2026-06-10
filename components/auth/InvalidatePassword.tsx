"use client";

import { useRef, useState } from "react";

type Props = {
  jwt: string;
};

import { useEffect } from "react";
import { useValidateTokenForgotPassword } from "@/hooks/query";

export default function InvalidatePassword({ jwt }: Props) {
  const [timeLeft, setTimeLeft] = useState('');
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isExpired, setIsExpired] = useState(false);

  const { data, isLoading, error } = useValidateTokenForgotPassword(jwt);

  useEffect(() => {
    if (!data?.inSecond) return;

    const minutes = Math.floor(data.inSecond / 60);
    const seconds = data.inSecond % 60;

    setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
  }, [data]);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      const [minutes, seconds] = timeLeft.split(":").map(Number);

      const totalSeconds = minutes * 60 + seconds;

      if (totalSeconds <= 1) {
        clearInterval(timer);

        setTimeLeft("00:00");
        setIsExpired(true);

        return;
      }

      const nextSeconds = totalSeconds - 1;

      const nextMinutes = Math.floor(nextSeconds / 60);

      const remainSeconds = nextSeconds % 60;

      setTimeLeft(`${String(nextMinutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return;
    }

    validateOtp(otpValue);
  }, [otp]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = async (otpCode: string) => {
    try {
      
    } catch (e) {

    }
  }

  if (error || isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-red-100">
              <i className="ri-error-warning-line text-6xl text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Link Tidak Valid
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              Link reset password yang Anda gunakan tidak valid,
              sudah kadaluarsa, atau telah digunakan sebelumnya.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <i className="ri-information-line mt-0.5 text-xl text-amber-600" />

                <div className="text-left text-sm text-amber-800">
                  Silakan lakukan permintaan reset password kembali
                  untuk mendapatkan link baru yang masih aktif.
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                onClick={() =>
                (window.location.href =
                  "/akademik/login")
                } >
                Kembali ke Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl">
          <div className="text-center">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
              <i className="ri-hourglass-line hourglass-animation text-5xl text-amber-600" />
            </div>
            <p className="mt-4 text-slate-500">
              Sistem sedang memverifikasi link yang Anda gunakan.
              Mohon tunggu beberapa saat...
            </p>
          </div>
        </div>
        <style jsx>
          {`
          .hourglass-animation {
            display: inline-block;
            animation: hourglassRotate 1s ease-in-out infinite;
            transform-origin: center;
          }

          @keyframes hourglassRotate {
            0% {
              transform: rotate(0deg);
            }

            40% {
              transform: rotate(0deg);
            }

            50% {
              transform: rotate(180deg);
            }

            90% {
              transform: rotate(180deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Verifikasi OTP
          </h1>
          <p className="mb-8 text-base leading-relaxed text-slate-500">
            Masukkan 6 digit kode OTP yang
            dikirim ke email Anda.
          </p>

          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    index
                  )
                }
                className="aspect-square w-12 sm:w-15 md:w-15 rounded-xl border border-slate-300 text-center text-base sm:text-lg md:text-lg font-bold"
              />
            ))}
          </div>

          <div className="text-center">
            {/* <p className="text-base text-slate-500">
              Tidak menerima kode?{" "}
              <button type="button" className="font-medium text-blue-400 hover:text-blue-500">
                Kirim ulang
              </button>
            </p> */}

            <p className="mt-2 text-base text-slate-500">
              Sisa waktu {timeLeft}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}