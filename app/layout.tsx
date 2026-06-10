import { Outfit } from 'next/font/google';
import "./globals.css";
import "flatpickr/dist/flatpickr.css";
import Providers from './providers'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import "remixicon/fonts/remixicon.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <Providers>
              {children}
            </Providers>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
