import "./login.css"
import LoginForm from "@/components/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  icons: {
    icon: "/assets/img/icons/education.svg",
  },
};

export default function SignIn() {
  return <LoginForm />;
}