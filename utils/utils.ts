import imageCompression, {
  Options
} from "browser-image-compression";
import isEmpty from "./isEmpty";

export const getBase64SizeInBytes = (base64: string) => {
  // hilangkan padding "="
  const padding = (base64.match(/=/g) || []).length;

  return ((base64.length * 3) / 4) - padding;
};

export const compressImage = async (
  file: File,
  onProgress?: (
    progress: number
  ) => void
): Promise<File> => {
  // sebelum compress
  console.log("before", (file.size / 1024 / 1024).toFixed(2), "MB");

  // skip jika <= 1MB
  if (file.size <= 1024 * 1024) {
    return file;
  }

  const setting: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  if (onProgress) {
    setting.onProgress = (
      progress: number
    ) => {
      onProgress(progress);
    };
  }

  const compressedFile = await imageCompression(
    file,
    setting
  );

  // sesudah compress
  console.log("after", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");

  return compressedFile;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;
  });
};

export const formatTanggalIndonesia = (tanggal: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

export const allowPage = (allow_tipe: any, allow_role: any, tipe_account: string, tipe_role: string) => {
  const isAllowed = allow_tipe.includes(tipe_account) && allow_role.includes(tipe_role);
  return isAllowed
}

export const downloadPdfFromBase64 = (base64: string, filename: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);

  // 🔥 buat link download
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // cleanup
  a.remove();
  URL.revokeObjectURL(url);
}

export const  runNanoID = async (n: any) => {
  const { customAlphabet } = await import('nanoid');
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const id = customAlphabet(alphabet, n);
  return id();
}

export const scramble = (a: any) => {
  let d;
  a = a.split(""); for (var b = a.length - 1; 0 < b; b--) { var c = Math.floor(Math.random() * (b + 1)); d = a[b]; a[b] = a[c]; a[c] = d } return a.join("")
}
