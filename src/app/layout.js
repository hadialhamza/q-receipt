import { Montserrat_Alternates, DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

const montserratAlternates = Montserrat_Alternates({
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-logo",
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
        <ThemeProvider initialTheme={theme}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
