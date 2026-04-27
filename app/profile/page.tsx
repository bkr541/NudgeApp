"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui";

import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-[#f4f4f7] font-sans">
      <div className="bg-white pt-safe pb-4 px-6 sticky top-0 z-10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-black leading-none text-[#18181b] tracking-tight mt-6">Profile</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-6">
        <section className="bg-white rounded-[32px] p-6 shadow-xl border border-zinc-200/50 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold text-xl uppercase">
              {user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#18181b]">{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[32px] p-6 shadow-xl border border-zinc-200/50">
          <Button onPress={() => auth.signOut()} className="w-full bg-[#18181b] text-white font-bold h-12 rounded-xl text-[15px]">
            Log out
          </Button>
        </section>
      </div>
    </div>
  );
}
