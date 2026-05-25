"use client";

import React from "react";
import 'remixicon/fonts/remixicon.css'
import MainLayout from '@/components/ui/MainLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>
}