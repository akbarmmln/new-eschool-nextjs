"use client";

import Link from "next/link";
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation";
import {
  useState,
} from "react";
import { login } from "@/services/Call";

type ToastType =
  | "success"
  | "error";
import { EyeCloseIcon, EyeIcon } from "@/icons";

const showAlert = ({ icon, title, text = "" }: {
  icon: "success" | "warning" | "error";
  title: string;
  text?: string;
}) => {
  return Swal.fire({
    width: 350,
    heightAuto: true,
    icon,
    title,
    text,
    confirmButtonText: "OK",
    confirmButtonColor: "#2563eb",
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
    customClass: {
      popup: "swal-popup",
      icon: "swal-icon-custom",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-button",
    },
  });
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      await showAlert({
        icon: "warning",
        title: "Login tidak valid",
        text: "Email dan password wajib terisi",
      });
      return;
    }

    try {
      setLoading(true);

      const hasil: any = await login(
        email,
        password
      );

      if (!hasil.ok) {
        throw hasil;
      }
      await showAlert({
        icon: "success",
        title: "Login Berhasil",
      });
      router.push("/akademik/dashboard");
    } catch (e: any) {
      const statusCode = e.status_code
      const errCode = e.err_code
      const message = e.err_msg
      await showAlert({
        icon: "warning",
        title: "Login tidak valid",
        text: errCode === '70005' ? message : 'Terjadi kesalahan saat login. Silahkan coba kembali beberapa saat lagi',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-container">
        {/* RIGHT IMAGE */}
        <div className="login-right">
          <img
            src="/assets-login/background_school.png"
            className="bg-img loaded"
            alt="Background"
          />
        </div>

        {/* LEFT FORM */}
        <div className="login-left">
          <div className="login-card text-center">
            <img
              src="/assets-login/logo_tp.png"
              className="logo"
              alt="Logo"
            />

            <h4 className="title">
              <span className="title-main">
                Welcome to daily dan
                weekly report
              </span>

              <br />

              <span className="title-sub">
                Khalifa IMS Nursery &
                Kindergarten
              </span>
            </h4>

            {/* EMAIL */}
            <div className="mb-3 label text-start">
              <label>Email</label>

              <input
                type="email"
                className="form-control"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4 text-start">
              <label className="mb-2 block">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control password-input"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  className="password-toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  } >
                  {showPassword ? (
                    <EyeIcon className="eye-icon" />
                  ) : (
                    <EyeCloseIcon className="eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="btn btn-login w-100"
              onClick={handleLogin}
              disabled={loading} >
              {loading
                ? "Memproses masuk..."
                : "Masuk"}
            </button>

            {/* FORGOT PASSWORD */}
            <div className="mt-3">
              <Link href="/akademik/lupa-password" className="forgot-password" >
                Lupa Password ?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .swal-popup {
          border-radius: 15px;
        }

        .swal-icon-custom {
          transform: scale(0.72);

          margin-top: 8px !important;
          margin-bottom: -10px !important;
        }

        .swal-title {
          font-size: 30px !important;
          font-weight: 200 !important;
        }

        .swal-text {
          font-size: 17px !important;
          font-weight: 500 !important;
        }

        .swal-button {
          border-radius: 10px !important;
          padding: 12px 28px !important;
          font-size: 18px !important;
          font-weight: 400 !important;
        }
      `}</style>
    </>
  );
}