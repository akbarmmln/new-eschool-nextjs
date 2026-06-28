"use client";

import React from "react";
import 'remixicon/fonts/remixicon.css'
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAccess } from '@/hooks/query'
import { AccessProvider } from '@/context/AccessContext'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useState
} from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen ? "ml-0" : isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]";
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // const token = sessionStorage.getItem("access-token");
    const token = localStorage.getItem("access-token");

    if (!token) {
      router.push('/akademik/login')
      return
    }

    setIsCheckingAuth(false)
  }, [router])


  const {
    data,
    isLoading,
    error,
    refetch
  } = useAccess({
    enabled: !isCheckingAuth
  })

  if (isCheckingAuth) {
    return null
  }


  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f5fb',
          flexDirection: 'column',
          gap: 20,
        }} >

        {/* SPINNER */}
        <div
          style={{
            width: 52,
            height: 52,
            border: '4px solid #dbe4ff',
            borderTop: '4px solid #696cff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />

        {/* TEXT */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#6b7280',
            letterSpacing: '.2px',
          }} >
          Memuat halaman...
        </div>

        {/* ANIMATION */}
        <style>
          {`
						@keyframes spin {
							0% {
								transform: rotate(0deg);
							}
							100% {
								transform: rotate(360deg);
							}
						}
      		`}
        </style>
      </div>
    )
  }

  if (error || !data) {
    return (
      <>
        <div className="access-error">
          <div className="error-card">
            <div className="error-icon">
              <i className="ri-error-warning-line" />
            </div>

            <h1>
              Gagal Memuat Halaman
            </h1>

            <p>
              Terjadi kesalahan saat mengambil akses halaman.
              Silahkan coba lagi.
            </p>

            <button onClick={() => refetch()} className="retry-btn">
              <i className="ri-refresh-line" />
              <span>
                Coba Lagi
              </span>
            </button>
          </div>
        </div>
        <style jsx>
          {`
            .access-error {

              min-height: 100vh;

              display: flex;

              align-items: center;

              justify-content: center;

              padding: 24px;
            }

            .error-card {

              width: 100%;

              max-width: 420px;

              background: #fff;

              border-radius: 24px;

              padding: 42px 32px;

              text-align: center;

              box-shadow:
                0 20px 50px rgba(0,0,0,.08);
            }

            .error-icon {

              width: 82px;

              height: 82px;

              border-radius: 999px;

              background:
                rgba(239,68,68,.12);

              color: #ef4444;

              display: flex;

              align-items: center;

              justify-content: center;

              margin: 0 auto 22px;
            }

            .error-icon i {

              font-size: 42px;
            }

            .error-card h1 {

              margin: 0;

              font-size: 28px;

              font-weight: 700;

              color: #111827;
            }

            .error-card p {

              margin-top: 12px;

              line-height: 1.7;

              font-size: 16px;

              color: #6b7280;
            }

            .retry-btn {

              margin-top: 28px;

              width: 100%;

              height: 52px;

              border: none;

              border-radius: 16px;

              background:
                linear-gradient(
                  90deg,
                  #5b7fff 0%,
                  #696cff 100%
                );

              color: #fff;

              font-size: 16px;

              font-weight: 700;

              cursor: pointer;

              display: flex;

              align-items: center;

              justify-content: center;

              gap: 10px;

              transition: .2s;
            }

            .retry-btn:hover {

              transform: translateY(-1px);

              opacity: .95;
            }
          `}
        </style>
      </>
    )
  }

  return (
    <AccessProvider access={data} >
      <div className="min-h-screen xl:flex">
        <AppSidebar />

        <Backdrop />

        <div className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}>

          <AppHeader />

          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
    </AccessProvider>
  );
}