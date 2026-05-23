"use client";

import { useProfile } from '@/hooks/query'
import {
  useEffect,
  useState,
} from "react";
import ModalTambahJurnal from '@/components/modals/ModalTambahJurnal'

export default function DashboardClient() {
   const {
    data,
    isLoading,
    error,
  } = useProfile();

  const [
    openModalTambahJurnal,
    setOpenModalTambahJurnal,
  ] = useState(false)

  return (
    <>
      <div className="greeting-card">
        <div className="greeting-left">
          {isLoading ? (
            <div className="skeletonTitle"/>
          ) : (
            <h1>
              Selamat Sore, {data?.nama}
            </h1>

          )}

          {isLoading ? (
            <div className="skeletonSubtitle"/>
          ) : (
            <p>
              daily & weekly report student of Khalifa IMS Nursery&Kindergarten
            </p>
          )}

          <div className="divider"></div>

          {isLoading ? (
            <div className="skeletonRole"/>
          ) : (
            <div className="role-box">
              <i className="ri-team-line" />
              <span>
                Admin & Guru wali kelas {data?.nama_kelas}
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

          <button className="btn-dashboard">
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
            onClose={() =>
              setOpenModalTambahJurnal(false)
            }
          />
        )
      }
      <div
        style={{
          display: 'grid',
          gap: 24,
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 30,
              minHeight: 260,
            }}
          >
            <h1>
              Congratulations John! 🎉
            </h1>

            <p
              style={{
                fontSize: 18,
                color: '#6b7280',
              }}
            >
              You have done 68% 😎
              more sales today.
            </p>

            <button
              style={{
                marginTop: 20,
                border: 'none',
                background:
                  '#696cff',
                color: '#fff',
                height: 52,
                padding:
                  '0 24px',
                borderRadius: 14,
                fontWeight: 600,
              }}
            >
              View Profile
            </button>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 260,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 260,
            }}
          />
        </div>

        {/* BOTTOM */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr',
            gap: 24,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />

          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              minHeight: 400,
            }}
          />
        </div>
      </div>
    </>
  );
}