"use client";

import { Input } from "@/components/ui/input";
import { Search, SunMoon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input className="pl-10" placeholder="Search errands, runners…" />
      </div>

      {/* profile */}
      <div className="flex items-center space-x-4">
        <SunMoon className="w-5 h-5 cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
              IG
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
