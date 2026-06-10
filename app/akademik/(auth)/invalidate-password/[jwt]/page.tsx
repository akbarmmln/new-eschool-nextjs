import InvalidatePassword from "@/components/auth/InvalidatePassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password",
  icons: {
    icon: "/assets/img/icons/education.svg",
  },
};

export default async function InvalidatePasswordPage({ params }: {
  params: Promise<{ jwt: string }>;
}) {
  const { jwt } = await params;
  return <InvalidatePassword jwt={jwt} />
}