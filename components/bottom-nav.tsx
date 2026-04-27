"use client";

import { usePathname, useRouter } from "next/navigation";
import { Calendar, CheckSquare, Settings, User } from "lucide-react";
import { useAuth } from "./auth-provider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const tabs = [
    { name: "Calendar", path: "/", icon: Calendar },
    { name: "Reminders", path: "/reminders", icon: CheckSquare },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="w-full bg-white border-t border-zinc-100 pb-safe z-50 flex-shrink-0">
      <div className="flex justify-around items-center h-[72px]">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-[#18181b]" : "text-[#a1a1aa] hover:text-[#71717a]"
              )}
            >
              <tab.icon size={24} strokeWidth={isActive ? 3 : 2} />
              <span className={cn("text-[10px] uppercase tracking-widest mt-1", isActive ? "font-black" : "font-bold")}>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
