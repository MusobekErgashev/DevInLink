import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevInLink",
  description: "DevInLink",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex w-full h-screen bg-background text-slate-100 overflow-hidden font-inter">
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '0px', background: '#0D0F17', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' } }} />
        <Menu />
        <main className="h-full w-full flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
