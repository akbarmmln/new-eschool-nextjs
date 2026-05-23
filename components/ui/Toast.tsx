"use client";

type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({
  message,
  type = "success",
}: ToastProps) {
  return (
    <div
      className={`
        toast show align-items-center border-0
        ${
          type === "success"
            ? "text-bg-success"
            : "text-bg-danger"
        }
      `}
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">
          {message}
        </div>

        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        />
      </div>
    </div>
  );
}