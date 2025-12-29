"use client";

import {
  LayoutDashboard,
  PackageSearch,
  Users,
  CreditCard,
  Bell,
  BarChart3,
  BookText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Errands", href: "/errands", icon: PackageSearch },
  { name: "Runners", href: "/runners", icon: Users },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Loyalty Engine", href: "/loyalty", icon: BarChart3 },
  { name: "Log Explorer", href: "/logs", icon: BookText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white shadow-sm hidden md:flex flex-col">
      <div className="p-6 font-bold text-xl">ERS Admin</div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-gray-100 text-black"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
