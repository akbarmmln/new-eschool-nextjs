import api from "./Api";
import Swal from 'sweetalert2'

type RequestMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete";

export interface RequestResponse<T = any> {

  ok: boolean;

  status_code: number;

  headers?: any;

  data?: T;

  message?: string;

  err_code?: string;

  err_msg?: string;

  err_details?: any;

  language?: string;

  timestamp?: string;
}

/* =========================
   PREVENT MULTI REDIRECT
========================= */

let isLoggingOut = false;

/* =========================
   LOGOUT HANDLER
========================= */

async function autoLogout() {

  if (isLoggingOut) return;

  isLoggingOut = true;

  // HAPUS TOKEN
  sessionStorage.removeItem(
    "access-token"
  );

  localStorage.clear();

  // MODAL
  await Swal.fire({
    icon: 'warning',
    title: 'Sesi Berakhir',
    text: 'Demi keamanan, Anda baru saja ter-logout otomatis. Login kembali untuk melanjutkan.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#2563eb',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });

  // REDIRECT
  window.location.href = '/akademik/login';
}

export async function request<T>(

  method: RequestMethod,

  endpoint: string,

  payload: any = {},

  timeout: number = 10000

): Promise<RequestResponse<T>> {

  try {

    const token = sessionStorage.getItem("access-token");

    const response = await api({
      method,
      url: endpoint,
      data: payload,
      timeout,
      headers: token ? { Authorization: token, } : {},
    });

    /* =========================
       REFRESH TOKEN
    ========================= */

    const newToken = response.headers["authorization"];

    if (newToken) {
      sessionStorage.setItem("access-token", newToken);
    }

    return {
      ok: true,
      status_code: response.status,
      headers: response.headers,
      data: response.data,
    };

  } catch (e: any) {
    if (e.code === "ECONNABORTED") {
      return {
        ok: false,
        status_code: 504,
        err_code: "TIMEOUT",
        err_msg: "service timeout",
      };
    }

    const status = e?.response?.status || 500;
    const body = e?.response?.data || {};

    if (status === 401 && body.err_code === '977777') {
      autoLogout();
    }

    return {
      ok: false,
      status_code: status,
      message: body?.message,
      err_code: body?.err_code,
      err_msg: body?.err_msg,
      err_details: body?.err_details,
      language: body?.language,
      timestamp: body?.timestamp,
    };
  }
}