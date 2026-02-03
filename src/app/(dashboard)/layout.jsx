import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8 pt-6">
          <div className="mx-auto w-full space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
