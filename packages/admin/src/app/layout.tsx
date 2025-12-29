import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <Topbar />

          <main className="p-6 overflow-y-auto h-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
