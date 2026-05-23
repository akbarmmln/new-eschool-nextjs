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
      <div
        className={`py-8 flex ${!isExpanded && !isHovered
            ? "lg:justify-center"
            : "justify-start"
          }`} >
            
        <Link href="/">
          {isExpanded ||
            isHovered ||
            isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />

              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col flex-1 min-h-0"
        style={{
          overflow: "hidden",
        }} >

        <nav className="flex-1 overflow-y-auto overscroll-contain no-scrollbar pr-1" style={{ minHeight: 0 }} >
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "justify-start"
                }`} >

              {isExpanded ||
                isHovered ||
                isMobileOpen ? (
                "Menu"
              ) : (
                <HorizontaLDots />
              )}
            </h2>

            <ul className="flex flex-col gap-2">
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
                    style={{
                      height: 45,
                      borderRadius: 12,
                      marginBottom: 1,
                      display: "flex",
                      alignItems: "center",
                      padding: isMobile ? "0 16px" : collapsed && !hovered ? "0" : "0 16px",
                      justifyContent: isMobile ? "flex-start" : collapsed && !hovered ? "center" : "flex-start",
                      gap: 12,
                      textDecoration: "none",
                      background: active ? "#5b8def" : "transparent",
                      color: active ? "#ffffff" : "#111827",
                      transition: "all .2s ease",
                      flexShrink: 0,
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
                    {(isMobile ||
                      !collapsed ||
                      hovered) && (
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 400,
                            letterSpacing: "-0.2px",
                            whiteSpace: "nowrap",
                          }} >
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
          style={{
            paddingTop: 16,
            paddingBottom: isMobileOpen ? 90 : 20,
            flexShrink: 0,
            background: "#fff",
            position: "sticky",
            bottom: 0,
            zIndex: 20,
          }} >

          {(isMobileOpen || isExpanded || isHovered) && (
            <div
              style={{
                marginTop: "auto",
                paddingTop: 16,
                paddingBottom: 20,
                flexShrink: 0,
              }} >

              <div
                style={{
                  background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
                  border: "1px solid rgba(203,213,225,0.7)",
                  borderRadius: 15,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
                }} >

                {/* LEFT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                    flex: 1,
                  }} >

                  {/* AVATAR */}
                  {loadingCardProfile ? (
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: '999px',
                        background: '#cbd5e1',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <img
                      src='/assets/img/avatars/1.png'
                      alt="avatar"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "999px",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "2px solid #fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                  )}

                  {/* NAME + ROLE */}
                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                    }} >

                    {/* NAME */}
                    {loadingCardProfile ? (
                      <div
                        style={{
                          width: 100,
                          height: 18,
                          borderRadius: 8,
                          background: '#cbd5e1',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#111827",
                          lineHeight: 1.3,
                          fontFamily: 'Didot',
                        }} >
                        {data?.nama || ''}
                      </div>
                    )}

                    {/* ROLE */}
                    {loadingCardProfile ? (
                      <div
                        style={{
                          marginTop: 8,
                          width: 100,
                          height: 14,
                          borderRadius: 8,
                          background: '#cbd5e1',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          fontWeight: 400,
                          color: "#6b7280",
                        }} >
                        Administrator
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                {!loadingCardProfile && (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={() =>
                      setShowTooltip(true)
                    }
                    onMouseLeave={() =>
                      setShowTooltip(false)
                    } >

                    {/* TOOLTIP */}
                    <div
                      style={{
                        position: "absolute",
                        top: -52,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#111827",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        opacity: showTooltip ? 1 : 0,
                        visibility: showTooltip ? "visible" : "hidden",
                        transition: "all .2s ease",
                        pointerEvents: "none",
                        boxShadow: "0 10px 25px rgba(0,0,0,.12)",
                        zIndex: 100,
                      }} >
                      Logout
                      {/* ARROW */}
                      <div
                        style={{
                          position: "absolute",

                          bottom: -5,

                          left: "50%",

                          transform:
                            "translateX(-50%) rotate(45deg)",

                          width: 10,

                          height: 10,

                          background:
                            "#111827",
                        }}
                      />

                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() => {

                        sessionStorage.removeItem(
                          "access-token"
                        );

                        window.location.href =
                          "/akademik/login";

                      }}
                      style={{
                        width: 42,

                        height: 42,

                        border: "none",

                        borderRadius: 12,

                        background:
                          "rgba(148,163,184,0.08)",

                        color: "#64748b",

                        cursor: "pointer",

                        flexShrink: 0,

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        transition:
                          "all .2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "#ef4444";

                        e.currentTarget.style.color =
                          "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(148,163,184,0.08)";

                        e.currentTarget.style.color =
                          "#64748b";
                      }}
                    >

                      <i
                        className="ri-logout-circle-r-line"
                        style={{
                          fontSize: 22,
                        }}
                      />

                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;