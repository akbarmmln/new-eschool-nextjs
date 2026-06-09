import LupaPassword from "@/components/auth/LupaPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password",
  icons: {
    icon: "/assets/img/icons/education.svg",
  },
};

export default function LupaPasswordPage() {
  return <LupaPassword />;
}