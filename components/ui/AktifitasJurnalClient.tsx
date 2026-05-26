"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  PencilLine,
  FilePenLine,
} from "lucide-react";

import { useDetailJurnal } from "@/hooks/queryJurnal";

type Student = {
  row_id: string;
  id: string;
  id_siswa: string;
  name: string;
  status: "hadir" | "ijin" | "sakit" | "alpha";
};

type Props = {
  id: string;
};

const convertAbsensiToStatus = (
  absensi: string
): Student["status"] => {
  switch (absensi) {
    case "1":
      return "hadir";

    case "2":
      return "ijin";

    case "3":
      return "sakit";

    case "4":
      return "alpha";

    default:
      return "alpha";
  }
};

const convertStatusToAbsensi = (
  status: Student["status"]
): string => {
  switch (status) {
    case "hadir":
      return "1";

    case "ijin":
      return "2";

    case "sakit":
      return "3";

    case "alpha":
      return "4";

    default:
      return "4";
  }
};

const formatTanggalIndonesia = (tanggal: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
};

export default function AktifitasJurnalClient({ id }: Props) {
  const { data, isLoading, error } = useDetailJurnal(id);
  const [activeTab, setActiveTab] = useState<"absensi" | "penilaian">("absensi");
  const [students, setStudents] = useState<Student[]>([]);
  console.log('asdasdsad', data)

  useEffect(() => {
    if (data?.siswa) {
      const mappedStudents: Student[] = data.siswa.map(
        (item: any) => ({
          row_id: item.id_siswa,
          id: item.id,
          id_siswa: item.id_siswa,
          name: item.nama_siswa,
          status: convertAbsensiToStatus(item.absensi),
        })
      );
      setStudents(mappedStudents);
    }
  }, [data]);

  const handleStatusChange = (
    rowId: string,
    status: Student["status"]
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.row_id === rowId
          ? {
            ...student,
            status,
          }
          : student
      )
    );
  };

  const handleSaveAbsensi = () => {
    const payload = students.map((student) => ({
      id_detail_diajar: student.id,
      status: convertStatusToAbsensi(student.status),
    }));

    console.log('sadasdasdas', payload);

    alert("Absensi berhasil disimpan");
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-100 p-4 text-red-600">
        Gagal mengambil detail jurnal
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl text-slate-800 dark:text-white">
            Detail Jurnal
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Akademik</span>
            <span>/</span>
            <span>Jurnal Mengajar</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <PencilLine size={18} />
            Ubah Detail
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
            <FilePenLine size={18} />
            Ubah Item Nilai
          </button>
        </div>
      </div>

      {/* DETAIL CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <DetailSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DetailItem
              icon={
                <i
                  className="ri-calendar-2-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Tanggal dan Jam Mengajar"
              value={`${formatTanggalIndonesia(
                data?.jurnal?.tanggal_jurnal
              )} • ${data?.jurnal?.jam_mulai} - ${
                data?.jurnal?.jam_selesai
              }`}
            />

            <DetailItem
              icon={
                <i
                  className="ri-building-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Kelas"
              value={data?.jurnal?.nama_kelas || "-"}
            />

            <DetailItem
              icon={
                <i
                  className="ri-book-open-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Materi"
              value={data?.jurnal?.materi || "-"}
            />

            <DetailItem
              icon={
                <i
                  className="ri-graduation-cap-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Jumlah Siswa"
              value={`${data?.siswa?.length || 0} Siswa`}
            />

            <DetailItem
              icon={
                <i
                  className="ri-user-voice-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Refleksi"
              value={data?.jurnal?.refleksi || "-"}
            />

            <DetailItem
              icon={
                <i
                  className="ri-presentation-line"
                  style={{ fontSize: 22 }}
                />
              }
              title="Pengajar"
              value={data?.jurnal?.nama_guru || "-"}
            />
          </div>
        )}
      </div>

      {/* TAB */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("absensi")}
          className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
            activeTab === "absensi"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ClipboardCheck size={18} />
          Absensi
        </button>

        <button
          onClick={() => setActiveTab("penilaian")}
          className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
            activeTab === "penilaian"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FilePenLine size={18} />
          Penilaian
        </button>
      </div>

      {/* ABSENSI */}
      {activeTab === "absensi" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Daftar Kehadiran
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nama
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.row_id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-300">
                      {index + 1}.
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {student.name}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-5">
                        {[
                          "hadir",
                          "ijin",
                          "sakit",
                          "alpha",
                        ].map((status) => (
                          <label
                            key={status}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`status-${student.row_id}`}
                              checked={student.status === status}
                              onChange={() =>
                                handleStatusChange(
                                  student.row_id,
                                  status as Student["status"]
                                )
                              }
                              className="h-4 w-4 accent-blue-600"
                            />

                            <span className="text-sm capitalize text-slate-700 dark:text-slate-300">
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end p-6">
            <button
              onClick={handleSaveAbsensi}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              Simpan Absensi
            </button>
          </div>
        </div>
      )}

      {/* PENILAIAN */}
      {activeTab === "penilaian" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-white">
            Halaman Penilaian
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Silahkan buat form penilaian disini
          </p>
        </div>
      )}
    </div>
  );
}

type DetailItemProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

function DetailSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />

      <div className="flex-1">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  title,
  value,
}: DetailItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-10 text-slate-500 dark:text-slate-400">
          {value}
        </p>
      </div>
    </div>
  );
}