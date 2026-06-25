"use client";

import { useProfile } from '@/hooks/query'
import { useJurnal } from '@/hooks/queryJurnal'
import { useDropdownKelas } from '@/hooks/queryKelas'
import { useState } from "react";
import ModalTambahJurnal from '@/components/modals/ModalTambahJurnal'
import ModalPencarianJurnal from '@/components/modals/ModalPencarianJurnal'
import JournalList from '@/components/common/JournalList'
import { useAccessContext } from '@/context/AccessContext'

export default function DashboardAdmin() {
  const dataAccess = useAccessContext()
  const role = dataAccess?.access?.role || '';

  const [currentPage, setCurrentPage] = useState(1)
  const [openModalTambahJurnal, setOpenModalTambahJurnal] = useState(false)
  const [openModalPencarianJurnal, setOpenModalPencarianJurnal] = useState(false)

  const { data, isLoading, error } = useProfile();
  const {
    data: dataJurnal,
    error: errorJurnal,
    refetch: refetchJurnal,
    isLoading: isLoadingJurnal,
  } = useJurnal(currentPage.toString())

  const {
    data: dataListAllKelas,
    error: errorListAllKelas,
    refetch: refetchListAllKelas,
    isLoading: isLoadingListAllKelas,
  } = useDropdownKelas()

  return (
    <>
      <div className="greeting-card">
        <div className="greeting-left">
          {isLoading ? (
            <div className="skeletonTitle" />
          ) : (
            <h1>
              Selamat Sore, {data?.nama || ''}
            </h1>

          )}

          {isLoading ? (
            <div className="skeletonSubtitle" />
          ) : (
            <p>
              daily & weekly report student of Khalifa IMS Nursery&Kindergarten
            </p>
          )}

          <div className="divider"></div>

          {isLoading ? (
            <div className="skeletonRole" />
          ) : (
            <div className="role-box">
              <i className="ri-team-line" />
              <span>
                {role == '0' || role == '9' ? 'Admin & Guru wali kelas ' : 'Guru wali kelas '}
                 {data?.nama_kelas || ''}
              </span>
            </div>
          )}
        </div>

        <div className="greeting-right">
          <div className="float-wrapper fw1">
            <svg className="float-icon f1" viewBox="0 0 24 24" >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"></path>
            </svg>
          </div>

          <div className="float-wrapper fw2">
            <svg className="float-icon f2" viewBox="0 0 24 24" >
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path>
            </svg>
          </div>

          <div className="float-wrapper fw3">
            <svg className="float-icon f3" viewBox="0 0 24 24" >
              <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="dashboard-action">
        <button className="btn-dashboard">
          <i className="ri-file-list-3-line" />
          <span>
            Laporan Mingguan
          </span>
        </button>

        <div className="dashboard-action-right">
          <button
            className="btn-dashboard"
            onClick={() =>
              setOpenModalTambahJurnal(true)
            }  >
            <i className="ri-add-circle-fill" />
            <span>
              Tambah Jurnal
            </span>
          </button>

          <button className="btn-dashboard"
            onClick={() =>
              setOpenModalPencarianJurnal(true)
            }  >

            <i className="ri-search-line" />
            <span>
              Cari Jurnal
            </span>
          </button>
        </div>
      </div>

      {
        openModalTambahJurnal && (
          <ModalTambahJurnal
            kelas={dataListAllKelas || []}
            isLoadingKelas={isLoadingListAllKelas}
            onClose={() =>
              setOpenModalTambahJurnal(false)
            }
          />
        )
      }

      {
        openModalPencarianJurnal && (
          <ModalPencarianJurnal 
            onClose={() =>
              setOpenModalPencarianJurnal(false)
            }
            onSearch={(filter) => {
              console.log('sadasdasd', filter)
              setOpenModalPencarianJurnal(false);
            }}
          />
        )
      }

      {
        isLoadingJurnal ? (
          <div className="journal-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="journal-skeleton"
              />
            ))}
          </div>
        ) : errorJurnal ? (
          <div className="journal-error">
            <div className="journal-error-card">
              <div className="journal-error-icon">
                <i className="ri-error-warning-line" />
              </div>

              <h2>Gagal Memuat Jurnal</h2>

              <p>
                Terjadi kesalahan saat mengambil data jurnal.
              </p>

              <button onClick={() => refetchJurnal()}>
                <i className="ri-refresh-line" />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        ) : (dataJurnal?.rows?.length ?? 0) === 0 ? (
              <div className="flex min-h-[450px] items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <i className="ri-book-open-line text-5xl text-white" />
                  </div>

                  <h2 className="mb-3 text-3xl font-bold text-slate-800">
                    Belum Ada Jurnal
                  </h2>

                  <p className="mb-8 text-slate-500">
                    Tidak ditemukan riwayat jurnal pembelajaran.
                    Mulailah mencatat aktivitas pembelajaran
                    harian untuk memantau perkembangan siswa.
                  </p>
                </div>
              </div>
        ) : (
          <JournalList
            data={dataJurnal?.rows || []}
            currentPage={dataJurnal?.currentPage || 1}
            totalPage={dataJurnal?.totalPage || 1}
            onPageChange={setCurrentPage}
          />
        )
      }

      <style jsx>
        {`
        .journal-error {
          width: 100%;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .journal-error-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 15px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,.06);
        }

        .journal-error-icon {
          width: 60px;
          height: 60px;
          border-radius: 999px;
          background: rgba(239,68,68,.1);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }

        .journal-error-icon i {
          font-size: 30px;
        }

        .journal-error-card h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .journal-error-card p {
          margin-top: 10px;
          color: #6b7280;
          line-height: 1.7;
        }

        .journal-error-card button {
          margin-top: 24px;
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(90deg, #5b7fff, #696cff);
          color: white;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: .2s;
        }

        .journal-error-card button:hover {
          transform: translateY(-2px);
        }

        :global(.dark) .journal-error-card {
          background: #162033;
        }

        :global(.dark) .journal-error-card h2 {
          color: white;
        }

        :global(.dark) .journal-error-card p {
          color: rgba(255,255,255,.7);
        }

        .journal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 24px;
        }
        @media (max-width: 768px) {
          .journal-grid {
            grid-template-columns:
              1fr;
          }
        }

        .journal-skeleton {
          height: 300px;
          border-radius: 28px;
          background:linear-gradient( 90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
          background-size: 400% 100%;
          animation: skeleton-loading 1.4s ease infinite;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0 50%;
          }
        }

        :global(.dark) .journal-skeleton {
          background: linear-gradient(90deg, #1e293b 25%, #334155 37%, #1e293b 63%);
          background-size:400% 100%;
        }
      `}
      </style>
    </>
  );
}