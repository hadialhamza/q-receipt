import { Montserrat_Alternates, DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";

const montserratAlternates = Montserrat_Alternates({
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "QReceipt",
  description: "Generate Invoice receipts with QR code",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body
        className={`${montserratAlternates.variable} ${dmSans.variable} ${outfit.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider initialTheme={theme}>
            {children}
            <Toaster position="top" richColors closeButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
