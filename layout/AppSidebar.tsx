"use client";

import { useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { HorizontaLDots } from "../icons/index";
import { useAccess, useProfile } from '@/hooks/query'

const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
  } = useSidebar();

  const {
    data: menus = [],
    isLoading,
    error,
    refetch: refetchMenu
  } = useAccess()

  const {
    data,
    isLoading: loadingCardProfile,
  } = useProfile()

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <aside className={
      `fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${isExpanded || isMobileOpen
        ? "w-[290px]"
        : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
      ${isMobileOpen
        ? "translate-x-0"
        : "-translate-x-full"
      }
      lg:translate-x-0`
    }

      onMouseEnter={() => {
        if (!isExpanded) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }} >

      {/* LOGO */}
      <div className={`h-[80px] flex items-center ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`} >

        <Link
          href="/" className="flex items-center" >

          {isExpanded || isHovered || isMobileOpen ? (
            <>
            <Image
              className="dark:hidden"
              src="/images/logo/logo_tp_expand.png"
              alt="logo"
              width={280}
              height={80}
              priority
              style={{
                width: "100%",
                maxWidth: 280,
                height: "auto",
                objectFit: "contain",
              }}
            />

            <Image
              className="hidden dark:block"
              src="/images/logo/logo_tp_expand.png"
              alt="logo"
              width={280}
              height={80}
              priority
              style={{
                width: "100%",
                maxWidth: 280,
                height: "auto",
                objectFit: "contain",
              }}
            />
            </>
          ) : (
            <Image
              src="/images/logo/logo_tp.png"
              alt="Logo"
              width={40}
              height={40}
            />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col flex-1 min-h-0"
        style={{
          overflow: "hidden",
        }} >

        <nav className="flex-1 overflow-y-auto overscroll-contain no-scrollbar pr-1 py-4" style={{ minHeight: 0 }} >
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "justify-start"
                }`} >

              {isExpanded ||
                isHovered ||
                isMobileOpen ? (
                "MENU"
              ) : (
                <HorizontaLDots />
              )}
            </h2>

            <ul className="flex flex-col gap-4">
              {/* LOADING */}
              {isLoading && Array.from({ length: 6 }).map((_, index) => {
                const collapsed = !isExpanded;
                const hovered = isHovered;
                const isMobile = isMobileOpen;

                return (
                  <div
                    key={index}
                    style={{
                      height: 45,
                      borderRadius: 12,
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                      padding: isMobile ? "0 16px" : collapsed && !hovered ? "0" : "0 16px",
                      justifyContent: isMobile ? "flex-start" : collapsed && !hovered ? "center" : "flex-start",
                      gap: 12,
                      background: "rgba(229,231,235,0.65)",
                      animation: "pulse 1.5s infinite",
                      flexShrink: 0,
                    }} >

                    {/* ICON SKELETON */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 8,
                        background: "#d1d5db",
                        flexShrink: 0,
                      }}
                    />

                    {/* TEXT SKELETON */}
                    {(isMobile || !collapsed || hovered) && (
                      <div
                        style={{
                          width: 120,
                          height: 14,
                          borderRadius: 999,
                          background: "#d1d5db",
                        }}
                      />
                    )}
                  </div>
                );
              }
              )}

              {/* ERROR */}
              {!isLoading && error && (
                <div
                  style={{
                    padding: "28px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }} >

                  {/* ICON */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(239,68,68,0.10)",
                      marginBottom: 16,
                      color: "#ef4444",
                      fontSize: 28,
                    }} >
                    <i className="ri-error-warning-line" />
                  </div>

                  {/* TITLE */}
                  <div
                    style={{
                      color: "#111827",
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 6,
                    }} >
                    Gagal mengambil menu
                  </div>

                  {/* DESCRIPTION */}
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      lineHeight: 1.5,
                      marginBottom: 18,
                    }} >
                    Terjadi kesalahan saat memuat sidebar menu
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => refetchMenu()}
                    style={{
                      height: 40,
                      border: "none",
                      borderRadius: 12,
                      background: "#5b8def",
                      color: "#fff",
                      padding: "0 18px",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all .2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity =
                        "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity =
                        "1";
                    }} >
                    Ulangi
                  </button>
                </div>
              )}

              {/* SUCCESS */}
              {!isLoading && !error && menus?.map((menu) => {
                const active = pathname === menu.href;
                const collapsed = !isExpanded;
                const hovered = isHovered;
                const isMobile = isMobileOpen;

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`h-[45px] rounded-xl mb-1 flex items-center gap-3 transition-all duration-200 flex-shrink-0 ${active ? "menu-item-active" : "menu-item-inactive"}`}
                    style={{
                      padding: isMobile ? "0 16px" : collapsed && !hovered ? "0" : "0 16px",
                      justifyContent: isMobile ? "flex-start" : collapsed && !hovered ? "center" : "flex-start",
                    }} >

                    {/* ICON */}
                    <i
                      className={menu.icon}
                      style={{
                        fontSize: 20,
                        minWidth: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />

                    {/* TEXT */}
                    {(isMobile || !collapsed || hovered) && (
                      <span className={`text-[15px] tracking-[-0.2px] whitespace-nowrap ${active ? "font-semibold" : "font-medium"}`} >
                        {menu.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* PROFILE CARD */}
        <div
          className=" sticky bottom-0 z-20 pt-4 pb-5 flex-shrink-0 bg-white dark:bg-gray-900"
          style={{
            paddingBottom: isMobileOpen ? 90 : 20,
          }} >

          {(isMobileOpen || isExpanded || isHovered) && (
            <div className=" rounded-2xl border p-4 flex items-center justify-between gap-3 border-gray-200 bg-gradient-to-b from-slate-50 to-indigo-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 shadow-sm" >

              {/* LEFT */}
              <div
                className="flex items-center gap-3 min-w-0 flex-1" >

                {/* AVATAR */}
                {loadingCardProfile ? (
                  <div className="w-[54px] h-[54px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                ) : (
                  <img
                    src="/assets/img/avatars/1.png"
                    alt="avatar"
                    className=" w-[52px] h-[52px] rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-md"
                  />
                )}

                {/* NAME + ROLE */}
                <div className="min-w-0 flex-1">

                  {/* NAME */}
                  {loadingCardProfile ? (
                    <div
                      className=" w-[100px] h-[18px] rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse"
                    />
                  ) : (
                    <div
                      className=" text-[15px] font-semibold leading-[1.3] truncate text-gray-900 dark:text-white"
                      style={{
                        fontFamily: "Didot",
                      }} >
                      {data?.nama || ""}
                    </div>
                  )}

                  {/* ROLE */}
                  {loadingCardProfile ? (
                    <div className=" mt-2 w-[100px] h-[14px] rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  ) : (
                    <div
                      className=" mt-1 text-[13px] text-gray-500 dark:text-gray-400" >
                      Administrator
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              {!loadingCardProfile && (
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)} >

                  {/* TOOLTIP */}
                  <div
                    className={`absolute top-[-52px] left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shadow-xl border
                      transition-all duration-200 ${showTooltip ? "opacity-100 visible" : "opacity-0 invisible"} bg-white text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700
                    `} >
                    Logout

                    {/* ARROW */}
                    <div className=" absolute bottom-[-5px] left-1/2 -translate-x-1/2 rotate-45 w-[10px] h-[10px] bg-white border-r border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 " />
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("access-token");
                      window.location.href = "/akademik/login";
                    }}
                    className=" w-[35px] h-[35px] rounded-2xl flex items-center justify-center transition-all duration-300 bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-lg shadow-red-500/20 dark:bg-red-500 dark:hover:bg-red-400 dark:shadow-red-500/30" >

                    <i
                      className="ri-logout-circle-r-line"
                      style={{
                        fontSize: 28,
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;