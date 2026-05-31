"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  PencilLine,
  FilePenLine,
} from "lucide-react";
import JournalEditor from '@/components/common/Editor'
import { useDetailJurnal, useUpdateAbsensi, useInisiasiPenilaian, 
  useSubmitItemPenilaian, useEditItemPenilaian, useUpdateJurnal, 
  useGetItemPenilaian, useSubmitNilai } from "@/hooks/queryJurnal";
import { showAlert } from "@/utils/swal";
import isEmpty from "@/utils/isEmpty";
import { useQueryClient } from '@tanstack/react-query'
import { compressImage, fileToBase64, formatTanggalIndonesia } from "@/utils/utils";

type Student = {
  id: string;
  name: string;
  status: "hadir" | "ijin" | "sakit" | "alpha" | null;
};

type Props = {
  id: string;
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

export default function AktifitasJurnal({ id }: Props) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"absensi" | "penilaian">("absensi");
  const [students, setStudents] = useState<Student[]>([]);
  const [penilaianItems, setPenilaianItems] = useState<{ id: string | null; value: string; }[]>([
    {
      id: null,
      value: "",
    },
  ]);
  const [deletedIdItemSilabus, setDeletedIdItemSilabus] = useState<string[]>([]);
  const [judul, setJudul] = useState("");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalEditItemPenilaian, setOpenModalEditItemPenilaian] = useState(false);
  const [openInputNilai, setOpenInputNilai] = useState(false);
  const [materiPembelajaran, setMateriPembelajaran] = useState("");
  const [refleksiPembelajaran, setRefleksiPembelajaran] = useState("");
  const [jamMulai, setJamMulai] = useState('')
  const [jamSelesai, setJamSelesai] = useState('')
  const [selectedSiswa, setSelectedSiswa] = useState<{
    idJurnal: string;
    idSiswa: string;
    idDiajar: string;
    nama: string;
  } | null>(null);
  const [nilaiItems, setNilaiItems] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<
    {
      id?: string;
      file?: File;
      url?: string;
      preview?: string;
      loading?: boolean;
      progress?: number;
      keterangan: string;
    }[]
  >([]);
  const [filesDeleted, setFilesDeleted] = useState<string[]>([]);

  const { data, isLoading, error, isFetching, refetch } = useDetailJurnal(id);
  const {
    data: dataItemPenilaian,
    isLoading: isLoadingItemPenilaian,
    isFetching: isFetchingItemPenilaian,
    refetch: refetchItemPenilaian,
  } = useGetItemPenilaian(id, {
    enabled: false,
  });
  const {
    data: dataInisiasiPenilaian,
    isLoading: isLoadingInisiasiPenilaian,
    isFetching: isFetchingInisiasiPenilaian,
  } = useInisiasiPenilaian(
    selectedSiswa?.idJurnal || "",
    selectedSiswa?.idSiswa || "",
    selectedSiswa?.idDiajar || "",
    {
      enabled:
        !!selectedSiswa?.idJurnal &&
        !!selectedSiswa?.idSiswa &&
        !!selectedSiswa?.idDiajar,
    }
  );

  const saveAbsensiMutation = useUpdateAbsensi();
  const submitItemPenilaian = useSubmitItemPenilaian();
  const editItemPenilaian = useEditItemPenilaian();
  const updateJurnal = useUpdateJurnal();
  const submitNilai = useSubmitNilai();

  const isEditFormValid =
    !isEmpty(data?.jurnal?.id) &&
    !isEmpty(jamMulai) &&
    !isEmpty(jamSelesai) &&
    !isEditorEmpty(materiPembelajaran) &&
    !isEditorEmpty(refleksiPembelajaran);

  useEffect(() => {
    if (data?.jurnal) {
      setJamMulai(data.jurnal.jam_mulai || "");
      setJamSelesai(data.jurnal.jam_selesai || "");
      setMateriPembelajaran(data.jurnal.materi || "");
      setRefleksiPembelajaran(data.jurnal.refleksi || "");
    }

    if (data?.siswa) {
      const mappedStudents: Student[] =
        data?.siswa?.map((item: any) => ({
          id: item.id,
          name: item.nama_siswa,
          status:
            item.absensi === "1"
              ? "hadir"
              : item.absensi === "2"
                ? "ijin"
                : item.absensi === "3"
                  ? "sakit"
                  : item.absensi === "4"
                    ? "alpha"
                    : null,
        })) || [];
      setStudents(mappedStudents);
    }
  }, [data]);

  useEffect(() => {
    if (dataInisiasiPenilaian?.silabus?.[0]?.items) {
      const mapped =
        dataInisiasiPenilaian.silabus[0].items.map(
          (item: any) => ({
            id: item.id,
            nama_item: item.nama_item,
            nilai: item.nilai,
            keterangan: item.keterangan || "",
          })
        );

      setNilaiItems(mapped);
    }

    if (dataInisiasiPenilaian?.attachments.length > 0) {
      const mappedAttachments =
        dataInisiasiPenilaian?.attachments.map(
          (item: any) => ({
            id: item.id,
            url: item.url_image,
            keterangan: item.caption || "",
          })
        );

      setAttachments(mappedAttachments);
    }

  }, [dataInisiasiPenilaian]);

  const handleOpenModalEdit = () => {
    setJamMulai(data?.jurnal?.jam_mulai || "");
    setJamSelesai(data?.jurnal?.jam_selesai || "");
    setMateriPembelajaran(data?.jurnal?.materi || "");
    setRefleksiPembelajaran(data?.jurnal?.refleksi || "");

    setOpenModalEdit(true);
  };

  const handleOpenModalEditItemPenilaian = async () => {
    setDeletedIdItemSilabus([]);
    setOpenModalEditItemPenilaian(true);

    const result = await refetchItemPenilaian();
    const title_silabus = result?.data?.title_silabus;
    const dataPenilaian = result?.data?.items;

    if (dataPenilaian) {
      setJudul(title_silabus || "");
      setPenilaianItems(
        (dataPenilaian || []).map(
          (
            item: {
              id_item_silabus: string;
              item_silabus: string;
            }
          ) => ({
            id: item.id_item_silabus,
            value: item.item_silabus,
          })
        )
      );
    }
  };

  const handleCloseInputNilai = () => {
    setOpenInputNilai(false);
    setSelectedSiswa(null);
    setAttachments([]);
    setFilesDeleted([]);
    queryClient.removeQueries({
      queryKey: ['inisiasi-penilaian'],
    });
  };

  const handleOpenInputNilai = async (idJurnal: string, idSiswa: string, idDiajar: string, nama: string) => {
    setSelectedSiswa({ idJurnal, idSiswa, idDiajar, nama });
    setOpenInputNilai(true);
  };

  const handleChangeNilai = (id: string, nilai: number) => {
    setNilaiItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            nilai,
          }
          : item
      )
    );
  };

  const handleChangeKeterangan = (id: string, value: string) => {
    setNilaiItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            keterangan: value,
          }
          : item
      )
    );
  };

  const handleStatusChange = (rowId: string, status: Student["status"]) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === rowId
          ? {
            ...student,
            status,
          }
          : student
      )
    );
  };

  const handleAddItem = () => {
    setPenilaianItems((prev) => [
      ...prev,
      {
        id: null,
        value: "",
      },
    ]);
  };

  const handleRemoveItem = (id: string | null, index: number) => {
    // item lama dari database
    if (id) {
      setDeletedIdItemSilabus((prev) => [
        ...prev,
        id,
      ]);
    }

    setPenilaianItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleChangeItem = (index: number, value: string) => {
    setPenilaianItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, value }
          : item
      )
    );
  };

  const handleSaveAbsensi = async () => {
    try {
      const payload = students.map((student) => ({
        id_detail_diajar: student.id,
        status: student.status
          ? convertStatusToAbsensi(student.status)
          : null,
      }));

      const payloadSubmit = {
        id: id,
        absensi: payload
      }

      const hasil = await saveAbsensiMutation.mutateAsync(payloadSubmit);
      if (!hasil.ok) {
        throw hasil;
      }
      await showAlert(
        "success",
        "Berhasil",
        "Absensi berhasil disimpan"
      );
      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal menyimpan absensi`
      );
    }
  };

  const handleSavePenilaian = async (type: 0 | 1) => {
    try {
      let payload: {
        id_jurnal: string;
        judul: string;
        item_penilaian: { id: string | null; value: string; }[];
        id_diajar: string[];
        deleted_id_item_silabus: string[];
        updated: { id: string | null; value: string; }[];
      } = {
        id_jurnal: id,
        judul: judul,
        item_penilaian: penilaianItems.map((item) => ({ id: item.id, value: item.value.trim() })).filter((item) => item.value !== ""),
        id_diajar: [],
        deleted_id_item_silabus: [],
        updated: []
      };
      if (isEmpty(payload.judul)) {
        await showAlert(
          "warning",
          "Parameter tidak sesuai",
          `Grup/Judul Pembelajaran tidak boleh kosong`,
        );
        return
      }

      if (payload.item_penilaian.length == 0) {
        await showAlert(
          "warning",
          "Parameter tidak sesuai",
          `Item Penilaian setidak nya 1 untuk dilakukan`,
        );
        return
      }

      if (type === 0) {
        const hasil = await submitItemPenilaian.mutateAsync(payload);
        if (!hasil.ok) {
          throw hasil;
        }
        await showAlert(
          "success",
          "Berhasil",
          "Item penilaian berhasil disimpan"
        );
        setOpenModalEditItemPenilaian(false);
        await refetch();
      } else if (type === 1) {
        payload.deleted_id_item_silabus = deletedIdItemSilabus;
        payload.updated = payload.item_penilaian

        const hasil = await editItemPenilaian.mutateAsync(payload);
        if (!hasil.ok) {
          throw hasil;
        }
        await showAlert(
          "success",
          "Berhasil",
          "Item penilaian berhasil diperbaharui"
        );
        setOpenModalEditItemPenilaian(false);
        await refetch();
      }
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal menyimpan item penilaian`,
      );
    }
  };

  const handleUpdateJurnal = async () => {
    try {
      const payload = {
        id_jurnal: id,
        mulai: jamMulai,
        selesai: jamSelesai,
        materi: materiPembelajaran,
        refleksi: refleksiPembelajaran
      };

      const hasil = await updateJurnal.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Data jurnal berhasil diperbaharui"
      );

      setOpenModalEdit(false);
      
      await refetch();
    } catch (e: any) {
      await showAlert(
        "error",
        "Gagal",
        `Gagal memperbaharui data jurnal`,
      );
    }
  }

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    // placeholder skeleton
    const tempAttachments =
      files.map(() => {
        const tempId = crypto.randomUUID();
        return {
          id: tempId,
          loading: true,
          progress: 0,
          keterangan: "",
        };
      });

    // render skeleton langsung
    setAttachments((prev) => [
      ...prev,
      ...tempAttachments,
    ]);

    // proses async satu per satu
    files.forEach(async (rawFile, index) => {
      const tempId = tempAttachments[index].id;
      let fakeProgress = 0;

      const interval = setInterval(() => {
        fakeProgress = Math.min(
          fakeProgress + 10,
          95
        );
        setAttachments((prev) =>
          prev.map((item) => {
            if (item.id === tempId) {
              return {
                ...item,
                progress: fakeProgress,
              };
            }
            return item;
          })
        );

      }, 150);

      const compressedFile = await compressImage(rawFile);

      clearInterval(interval);

      const preview = URL.createObjectURL(compressedFile);

      // selesai
      setAttachments((prev) =>
        prev.map((item) => {
          if (item.id === tempId) {
            return {
              ...item,
              file: compressedFile,
              preview,
              loading: false,
              progress: 100,
            };
          }

          return item;
        })
      );
    }
    );
    e.target.value = "";
  };

  const handleChangeAttachmentCaption = (index: number, value: string) => {
    setAttachments((prev) =>
      prev.map((item, i) => {

        if (i === index) {
          return {
            ...item,
            keterangan: value,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveAttachment = (index: number) => {
    const selectedAttachment =
      attachments[index];

    if (selectedAttachment?.id) {
      const deletedId = selectedAttachment?.id;
      if (deletedId) {
        setFilesDeleted((prev) => [
          ...prev,
          deletedId,
        ]);
      }
    }

    setAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSaveAttachments = async () => {
    try {
      // attachment baru saja
      const newAttachments = attachments.filter((item) => item.file);

      // convert ke base64 + caption
      const newFiles = await Promise.all(
        newAttachments.map(async (item) => {
          const base64 =
            await fileToBase64(
              item.file as File
            );

          return {
            file: base64,
            caption: item.keterangan,
          };
        })
      );

      // radio button penilaian
      const penilaian = nilaiItems.map(
        (item: any) => ({
          id_mengajar: item.id,
          status: item.nilai,
          keterangan: item.keterangan,
        })
      );

      // payload final
      const payload = {
        id_jurnal: id,
        id_siswa: selectedSiswa?.idSiswa,
        filesDeleted: filesDeleted,
        files: newFiles,
        data: penilaian
      };

      // const sizeInBytes = getBase64SizeInBytes(payload.files[0].file);

      // const sizeInMB = sizeInBytes / 1024 / 1024;

      // console.log(sizeInMB.toFixed(2),"MB");

      // console.log('asdasdsaasd', payload);

      const hasil = await submitNilai.mutateAsync(payload);
      if (!hasil.ok) {
        throw hasil;
      }

      await showAlert(
        "success",
        "Berhasil",
        "Penilaian berhasil dilakukan"
      );

      handleCloseInputNilai();

      await refetch();
    } catch (e) {
      console.log('error nya ', e)
      await showAlert(
        "error",
        "Gagal",
        `Gagal menyimpan penilaian`,
      );
    }
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
          {isLoading || isFetching ? (
            <>
              <div className="h-[46px] w-[140px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-[46px] w-[170px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            </>
          ) : (
            <>
              <button onClick={handleOpenModalEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <PencilLine size={18} />
                Ubah Detail
              </button>

              {data?.jurnal?.initiate_nilai == 1 ? (
                <>
                  <button onClick={handleOpenModalEditItemPenilaian}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                    <FilePenLine size={18} />
                    Ubah Item Nilai
                  </button>
                </>
              ) : (<></>)}
            </>
          )}
        </div>
      </div>

      {/* DETAIL CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading || isFetching ? (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {[...Array(6)].map((_, index) => (
                <DetailSkeleton key={index} />
              ))}
            </div>
          </>
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
              value={`${formatTanggalIndonesia(data?.jurnal?.tanggal_jurnal)} • ${data?.jurnal?.jam_mulai} - ${data?.jurnal?.jam_selesai}`}
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
          className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${activeTab === "absensi"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
        >
          <ClipboardCheck size={18} />
          Absensi
        </button>

        <button
          onClick={() => setActiveTab("penilaian")}
          className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${activeTab === "penilaian"
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

          {isLoading || isFetching ? (
            <AbsensiTableSkeleton />
          ) : (
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
                    <tr key={student.id} className="border-b border-slate-100 dark:border-slate-800">
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
                              className="flex cursor-pointer items-center gap-2" >
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                checked={student.status === status}
                                onChange={() =>
                                  handleStatusChange(
                                    student.id,
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
          )}

          <div className="flex justify-end p-6">
            <button
              onClick={handleSaveAbsensi}
              disabled={
                saveAbsensiMutation.isPending ||
                isFetching
              }
              className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                ${saveAbsensiMutation.isPending || isFetching
                  ? "cursor-not-allowed bg-slate-400 shadow-none"
                  : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                }`} >

              {saveAbsensiMutation.isPending
                ? "Menyimpan..."
                : isFetching
                  ? "Memperbarui..."
                  : "Simpan Absensi"}
            </button>
          </div>
        </div>
      )}

      {/* PENILAIAN */}
      {activeTab === "penilaian" && (
        <>
          {isLoading || isFetching ? (
            <AbsensiTableSkeleton />
          ) : data?.jurnal?.initiate_absensi == 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Penilaian
                </h2>
              </div>

              <div className="flex items-center justify-center p-16">
                <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
                  <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                    <i
                      className="ri-error-warning-line"
                      style={{ fontSize: 30 }}
                    />
                  </div>

                  <h3 className="mt-3 text-1xl font-bold text-yellow-500">
                    PEMBERITAHUAN
                  </h3>

                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                    Silahkan lakukan absensi terlebih dahulu
                  </p>
                </div>
              </div>
            </div>
          ) : data?.jurnal?.initiate_nilai == 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Penilaian
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {/* GROUP/JUDUL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Grup/Judul Pembelajaran
                  </label>

                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Masukkan Grup/Judul pembelajaran"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    style={{
                      height: 45
                    }}
                  />
                </div>

                {/* ITEM PENILAIAN */}
                <div className="space-y-5">
                  {penilaianItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/30">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) =>
                            handleChangeItem(index, e.target.value)
                          }
                          placeholder="Isi item Penilaian"
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          style={{
                            height: 45
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id, index)}
                          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-red-600 dark:bg-slate-700"
                          style={{
                            height: 40,
                            width: 40
                          }} >
                          <i
                            className="ri-delete-bin-line"
                            style={{ fontSize: 15 }}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ACTION */}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handleAddItem} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                    <i className="ri-add-line" />
                    Tambah Item
                  </button>

                  <button
                    className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700
                      ${submitItemPenilaian.isPending || isFetching
                        ? "cursor-not-allowed bg-slate-400 shadow-none"
                        : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                      }`}
                    onClick={() => handleSavePenilaian(0)} >
                    <i className="ri-save-line" />

                    {submitItemPenilaian.isPending
                      ? "Menyimpan..."
                      : isFetching
                        ? "Memperbarui..."
                        : "Simpan Data"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Penilaian
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

                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.siswa?.map(
                        (siswa: any, index: number) => (
                          <tr key={siswa.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-300">
                              {index + 1}.
                            </td>

                            <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                              {siswa.nama_siswa}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-center gap-3">
                                <button
                                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                                  <i className="ri-download-line" />
                                  Download
                                </button>

                                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                  onClick={() =>
                                    handleOpenInputNilai(id, siswa.id_siswa, siswa.id, siswa.nama_siswa)
                                  } >
                                  <i className="ri-edit-line" />
                                  Input Nilai
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {openModalEdit && (
        <>
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Ubah Jurnal Mengajar
              </h2>

              <button
                onClick={() => setOpenModalEdit(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                <i
                  className="ri-close-line"
                  style={{ fontSize: 30 }}
                />
              </button>
            </div>

            {/* BODY */}
            <div className="space-y-6 p-6">
              {/* ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ID Jurnal
                </label>

                <input
                  type="text"
                  value={data?.jurnal?.id || ""}
                  disabled
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                />
              </div>

              {/* TANGGAL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Hari / Tanggal Mengajar
                </label>

                <input
                  type="text"
                  value={formatTanggalIndonesia(
                    data?.jurnal?.tanggal_jurnal
                  )}
                  disabled
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                />
              </div>

              {/* KELAS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kelas
                </label>

                <input
                  type="text"
                  value={data?.jurnal?.nama_kelas || ""}
                  disabled
                  className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                />
              </div>

              {/* JAM */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Jam Mulai
                  </label>

                  <input
                    type="time"
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Jam Selesai
                  </label>

                  <input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                  />
                </div>
              </div>

              {/* MATERI */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Materi Pembelajaran
                </label>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700">
                  <JournalEditor
                    name="materi_pembelajaran_edit"
                    value={materiPembelajaran}
                    onChange={setMateriPembelajaran}
                  />
                </div>
              </div>

              {/* REFLEKSI */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Refleksi Pembelajaran
                </label>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700">
                  <JournalEditor
                    name="refleksi_pembelajaran_edit"
                    value={refleksiPembelajaran}
                    onChange={setRefleksiPembelajaran}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
              <button
                onClick={() => setOpenModalEdit(false)}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200" >
                Batalkan
              </button>

              <button
                disabled={!isEditFormValid || updateJurnal.isPending}
                className={`rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                  ${!isEditFormValid || updateJurnal.isPending
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                  }`}
                onClick={handleUpdateJurnal} >
                {updateJurnal.isPending
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
        <style jsx>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
        </style>
        </>
      )}

      {openModalEditItemPenilaian && (
        <>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto hide-scrollbar rounded-3xl bg-white shadow-2xl">
              {/* HEADER */}
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 px-8 py-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Ubah Item Penilaian
                </h2>

                <button
                  onClick={() => setOpenModalEditItemPenilaian(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-red-500/90" >
                  <i
                    className="ri-close-line"
                    style={{ fontSize: 30 }}
                  />
                </button>
              </div>

              {/* BODY */}
              {isLoadingItemPenilaian || isFetchingItemPenilaian ? (
                <>
                  <div className="space-y-6 p-8">

                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />

                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />

                    {[1, 2].map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200 p-4" >
                        <div className="flex items-center gap-4">

                          <div className="h-12 flex-1 animate-pulse rounded-xl bg-slate-200" />

                          <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3">
                      <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-200" />

                      <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-200" />
                    </div>
                  </div>
                </>
              ) : (
              <>
                <div className="space-y-6 p-8">
                  {/* ID */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      ID
                    </label>

                    <input
                      type="text"
                      value={id}
                      disabled
                      className="h-[48px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                    />
                  </div>

                  {/* JUDUL */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Grup/Judul Pembelajaran
                    </label>

                    <input
                      type="text"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                      placeholder="Masukkan Grup/Judul pembelajaran"
                      className="h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
                    />
                  </div>

                  {/* ITEM */}
                  <div className="space-y-5">
                    {penilaianItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4" >
                        <div className="flex items-center gap-4">

                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              handleChangeItem(index, e.target.value)
                            }
                            placeholder="Isi item Penilaian"
                            className="h-[48px] flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm outline-none transition focus:border-blue-500"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id, index)}
                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-red-600"
                            style={{
                              height: 40,
                              width: 40,
                            }} >
                            <i
                              className="ri-delete-bin-line"
                              style={{ fontSize: 15 }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTION */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700" >
                      <i className="ri-add-line" />
                      Tambah Item
                    </button>

                    <button className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition
                      ${editItemPenilaian.isPending || isFetching
                          ? "cursor-not-allowed bg-slate-400 shadow-none"
                          : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                      }`}
                      disabled={
                        editItemPenilaian.isPending || isFetching
                      }
                      onClick={() => handleSavePenilaian(1)} >
                      <i className="ri-save-line" />

                      {editItemPenilaian.isPending
                        ? "Menyimpan..."
                        : isFetching
                          ? "Memperbarui..."
                          : "Simpan Data"}
                    </button>
                  </div>
                </div>
              </>
              ) }
            </div>
          </div>
        </>
      )}

      {openInputNilai && selectedSiswa && (
        <>
        <div className="fixed inset-0 z-[999999] bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <h1 className="text-[20px] font-bold text-slate-800">
                Input Nilai - {selectedSiswa.nama}
              </h1>

              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#529e94] text-[#FFFFFF] transition hover:bg-red-500 hover:text-white" 
                onClick={handleCloseInputNilai} >
                <i className="ri-close-line text-2xl" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="h-[calc(100vh-88px)] overflow-y-auto p-4 pb-32 md:p-6 md:pb-30">
              <div className="overflow-x-auto rounded-3xl border border-slate-200">
                {isLoadingInisiasiPenilaian || isFetchingInisiasiPenilaian ? (
                  <>
                  <AbsensiTableSkeleton />
                  </>
                ) : (
                    <>
                      <table className="min-w-[900px] w-full border-collapse">
                        <thead>
                          <tr>
                            <th rowSpan={2} className="border border-slate-200 px-4 py-5 text-center">
                              No
                            </th>

                            <th rowSpan={2} className="border border-slate-200 px-4 py-5 text-center">
                              Aktifitas
                            </th>

                            <th colSpan={4} className="border border-slate-200 px-4 py-5 text-center">
                              Hasil
                            </th>

                            <th rowSpan={2} className="border border-slate-200 px-4 py-5 text-center">
                              Keterangan
                            </th>
                          </tr>

                          <tr>
                            <th className="border border-slate-200 px-4 py-5">BSB</th>
                            <th className="border border-slate-200 px-4 py-5">BSH</th>
                            <th className="border border-slate-200 px-4 py-5">MB</th>
                            <th className="border border-slate-200 px-4 py-5">BB</th>
                          </tr>
                        </thead>

                        <tbody>
                          {nilaiItems.map((item: any, index: number) => (
                            <tr key={item.id}>
                              <td className="border border-slate-200 px-4 py-5 text-center">
                                {index + 1}
                              </td>

                              <td className="border border-slate-200 px-4 py-5">
                                {item.nama_item}
                              </td>

                              <td className="border border-slate-200 px-4 py-5 text-center">
                                <input
                                  type="radio"
                                  name={`nilai-${item.id}`}
                                  checked={item.nilai == 1}
                                  onChange={() =>
                                    handleChangeNilai(item.id, 1)
                                  }
                                />
                              </td>

                              <td className="border border-slate-200 px-4 py-5 text-center">
                                <input
                                  type="radio"
                                  name={`nilai-${item.id}`}
                                  checked={item.nilai == 2}
                                  onChange={() =>
                                    handleChangeNilai(item.id, 2)
                                  }
                                />
                              </td>

                              <td className="border border-slate-200 px-4 py-5 text-center">
                                <input
                                  type="radio"
                                  name={`nilai-${item.id}`}
                                  checked={item.nilai == 3}
                                  onChange={() =>
                                    handleChangeNilai(item.id, 3)
                                  }
                                />
                              </td>

                              <td className="border border-slate-200 px-4 py-5 text-center">
                                <input
                                  type="radio"
                                  name={`nilai-${item.id}`}
                                  checked={item.nilai == 4}
                                  onChange={() =>
                                    handleChangeNilai(item.id, 4)
                                  }
                                />
                              </td>

                              <td className="border border-slate-200 px-4 py-5">
                                <input
                                  type="text"
                                  value={item.keterangan}
                                  onChange={(e) =>
                                    handleChangeKeterangan(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Tuliskan keterangan tambahan..."
                                  className="h-12 w-full rounded-xl border border-slate-200 px-4"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                ) }
              </div>

              {isLoadingInisiasiPenilaian || isFetchingInisiasiPenilaian ? (
                <></>
              ) : (
                <>
                    {/* ATTACHMENT */}
                    <div className="mt-8">
                      <h2 className="mb-4 text-xl font-bold text-slate-800">
                        Upload Foto Tugas (Attachments)
                      </h2>

                      <div className="flex flex-wrap gap-4">
                        {/* ATTACHMENT LIST */}
                        {attachments.map((item, index) => (
                          <div key={index} className="w-[160px]" >
                            {/* IMAGE */}
                            <div className=" relative h-[160px] overflow-hiddenrounded-3xl bg-slate-100">

                              {/* SKELETON */}
                              {item.loading ? (
                              <div className=" absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-4">

                                <i className=" ri-image-line mb-4 text-4xl text-slate-400" />

                                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">

                                  <div className=" h-full rounded-full bg-blue-500 transition-all duration-300"
                                    style={{
                                      width: `${item.progress || 0}%`,
                                    }}
                                  />

                                </div>

                                <p className=" mt-3 text-sm font-medium text-slate-500 ">
                                  Compressing...
                                  {item.progress || 0}%
                                </p>
                              </div>
                              ) : (
                                <img
                                  src={item.preview || item.url}
                                  alt={`attachment-${index}`}
                                  className="h-full w-full object-contain p-2"
                                />
                              )}

                              {/* REMOVE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveAttachment(index)
                                }
                                className=" absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500">
                                <i className="ri-close-line text-2xl" />
                              </button>
                            </div>

                            {/* KETERANGAN */}
                            <textarea
                              value={
                                item.keterangan ||
                                (
                                  item.url
                                    ? "tidak ada deskripsi"
                                    : ""
                                )
                              }
                              readOnly={!!item.url}
                              disabled={!!item.url}
                              onChange={(e) =>
                                handleChangeAttachmentCaption(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Informasi tentang gambar..."
                              className={` mt-3 min-h-[90px] w-full rounded-2xl border border-slate-300 p-4 text-sm outline-none transition
                                ${item.url ? `cursor-not-allowed bg-slate-100 text-slate-500` : `bg-white focus:border-blue-500`}
                              `}
                            />
                          </div>
                        ))}

                        {/* BUTTON ADD */}
                        <label
                          className="flex h-[160px] w-[160px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-blue-500 hover:text-blue-500">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleUploadAttachment}
                          />

                          <i className="ri-add-line text-5xl" />
                        </label>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 py-4">
                      <div className="flex justify-end gap-3">

                        <button className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
                          onClick={handleCloseInputNilai} >
                          Tutup
                        </button>

                        <button className={`rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700
                            ${submitNilai.isPending || isFetching
                                ? "cursor-not-allowed bg-slate-400 shadow-none"
                                : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
                            }
                          `}
                          disabled={
                            submitNilai.isPending || isFetching
                          }
                          onClick={handleSaveAttachments} >
                          
                          {submitNilai.isPending
                            ? "Menyimpan..."
                            : isFetching
                              ? "Memperbarui..."
                              : "Simpan Nilai"}
                        </button>
                      </div>
                    </div>
                </>
              )}
            </div>
        </div>
        </>
      )}
    </div>
  );
}

function AbsensiTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            <th className="px-6 py-4 text-left">
              <div className="h-4 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>

            <th className="px-6 py-4 text-left">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>

            <th className="px-6 py-4 text-left">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </th>
          </tr>
        </thead>

        <tbody>
          {[...Array(2)].map((_, index) => (
            <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-6 py-5">
                <div className="h-4 w-6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </td>

              <td className="px-6 py-5">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </td>

              <td className="px-6 py-5">
                <div className="flex gap-4">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DetailItemProps = { icon: React.ReactNode; title: string; value: string };

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

function DetailItem({ icon, title, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          {title}
        </h3>

        <div
          className="prose prose-sm mt-1 max-w-none text-slate-500 dark:prose-invert dark:text-slate-400"
          dangerouslySetInnerHTML={{
            __html: value || "-",
          }}
        />
      </div>
    </div>
  );
}

const isEditorEmpty = (value: string) => {
  if (!value) return true;

  const text = value
    .replace(/<[^>]*>/g, "") // hapus tag html
    .replace(/&nbsp;/g, "")
    .trim();

  return text === "";
};