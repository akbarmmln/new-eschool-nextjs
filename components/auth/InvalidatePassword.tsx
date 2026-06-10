"use client";

import { useRef, useState } from "react";

type Props = {
  jwt: string;
};

import { useEffect } from "react";
import { useValidateTokenForgotPassword, useValidateOTP } from "@/hooks/query";
import dayjs from 'dayjs'

export default function InvalidatePassword({ jwt }: Props) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isExpired, setIsExpired] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [remainingAttempt, setRemainingAttempt] = useState(3);
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);

  const [sessionForUpdate, setSessionForUpdate] = useState('')
  const [showFormVerifyOTP, setShowFormVerifyOTP] = useState(true);
  const [showFormResetPassword, setShowFormResetPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = useValidateOTP();
  const { data, isLoading, error } = useValidateTokenForgotPassword(jwt);

  useEffect(() => {
    if (!data) return;

    if (data.counter < 3) {
      setOtpError(`kode OTP tidak valid. Batas percobaan ${data.counter} kali tersedia`);
    }
    if (data.counter == 0) {
      setIsOtpDisabled(true);
      setOtpError(`Anda telah melakukan 3 kali percobaan memasukkan kode OTP. Anda bisa mencoba kembali pada ${dayjs(data.next_sent).format('DD-MM-YYYY HH:mm:ss')}`);
    }

    setRemainingAttempt(data.counter);
    setTimeLeft(data.inSecond);
  }, [data]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev ?? 0) - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return;
    }

    validateHandleOtp(otpValue);
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

  const validateHandleOtp = async (otpCode: string) => {
    try {
      setIsVerifyingOtp(true);
      const payload = {
        type: 'reset-password',
        otp: otpCode,
        jwt: jwt
      }

      const hasil: any = await validate.mutateAsync(payload)
      
      if (!hasil.ok) {
        throw hasil;
      }
      const session = hasil.data.data
      setSessionForUpdate(session)
      setShowFormResetPassword(true)
      setShowFormVerifyOTP(false)
      setOtpError('');
    } catch (e: any) {
      const err_code = e.err_code;
      if (err_code == '70023') {
        setRemainingAttempt(0);
        setIsExpired(true);
      } else if (err_code == '70022') {
        const nextAttempt = remainingAttempt - 1;
        setRemainingAttempt(nextAttempt);
        setOtpError(`kode OTP tidak valid. Batas percobaan ${nextAttempt} kali tersedia`);
      }

      setOtp(["", "", "", "", "", ""]);
      setSessionForUpdate('')
      setShowFormVerifyOTP(true)
      setShowFormResetPassword(false)
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
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
              sudah kadaluarsa, telah digunakan sebelumnya atau
              telah mengalami percobaan beberapa kali.
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
                  "/akademik/lupa-password")
                } >
                Minta Link Baru
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

  const displayTime =
    timeLeft === null
      ? "--:--"
      : `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;

  return (
    <>
      {showFormVerifyOTP && (
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
                  disabled={isOtpDisabled}
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
                  className={`aspect-square w-12 sm:w-15 md:w-15 rounded-xl border border-slate-300 text-center text-base sm:text-lg md:text-lg font-bold
                  ${isOtpDisabled ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300"
                    }
                `}
                />
              ))}
            </div>

            {otpError && (
              <div className="mb-5 text-center">
                <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
                  <i className="ri-error-warning-line text-red-500" />

                  <span className="text-sm font-medium text-red-600">
                    {otpError}
                  </span>
                </div>
              </div>
            )}

            <div className="text-center">
              {/* <p className="text-base text-slate-500">
              Tidak menerima kode?{" "}
              <button type="button" className="font-medium text-blue-400 hover:text-blue-500">
                Kirim ulang
              </button>
            </p> */}

              <p className="mt-5 text-base text-slate-500">
                Sisa waktu {displayTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {showFormResetPassword && (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-slate-800">
              Password Baru
            </h1>

            <p className="mb-8 text-base text-slate-500">
              Silakan masukkan kata sandi baru Anda.
            </p>

            {/* Password */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-md border border-slate-200 px-4 pr-12 outline-none transition focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"} />
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Konfirmasi password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-md border border-slate-200 px-4 pr-12 outline-none transition focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className={showConfirmPassword ? "ri-eye-line" : "ri-eye-off-line"} />
                </button>
              </div>
            </div>

            <button
              type="button"
              className=" h-12 w-full rounded-md bg-indigo-500 text-white font-medium transition hover:bg-indigo-600">
              Simpan
            </button>
          </div>
        </div>
      )}

      {isVerifyingOtp && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center">

              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                <i className="ri-loader-4-line animate-spin text-5xl text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Memverifikasi OTP
              </h2>

              <p className="mt-3 text-slate-500">
                Mohon tunggu beberapa saat.
                <br />
                Sistem sedang memvalidasi kode OTP Anda.
              </p>

            </div>
          </div>
        </div>
      )}
    </>
  );
}