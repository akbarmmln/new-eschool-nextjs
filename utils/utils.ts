import imageCompression from "browser-image-compression";

export const getBase64SizeInBytes = (base64: string) => {
  // hilangkan padding "="
  const padding = (base64.match(/=/g) || []).length;

  return ((base64.length * 3) / 4) - padding;
};

export const compressImage = async (file: File): Promise<File> => {
  // sebelum compress
  console.log("before", (file.size / 1024 / 1024).toFixed(2), "MB");

  // skip jika <= 1MB
  if (file.size <= 1024 * 1024) {
    return file;
  }

  const compressedFile = await imageCompression(
    file,
    {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
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