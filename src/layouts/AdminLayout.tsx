import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-void">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1">
        {!isSupabaseConfigured && (
          <div className="border-b border-purple-400/30 bg-purple-core/10 px-6 py-2.5 text-center text-xs font-medium text-purple-300">
            Demo mode: Supabase isn't configured, so changes here are stored in memory only for this session.
          </div>
        )}
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
