import Swal from "sweetalert2";

type SwalType = "success" | "error" | "warning" | "info";

export const showAlert = async (
  type: SwalType,
  title: string,
  text: string
) => {
  return await Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonText: "OK",

    confirmButtonColor:
      type === "success"
        ? "#2563eb"
        : type === "error"
          ? "#dc2626"
          : "#eab308",

    scrollbarPadding: false,
    heightAuto: false,
    backdrop: `rgba(15,23,42,0.55)`,
  });
};