import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden p-4">
        <Menu size={24} />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
