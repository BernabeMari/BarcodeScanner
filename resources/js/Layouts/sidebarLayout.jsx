import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function SidebarLayout({ children }) {
  const { props } = usePage();
  const role = props.auth.user.role; 
  const current =
    route().current("items_page") ? "available" :
    route().current("break_items_page") ? "broken" :
    route().current("inactive_items_page") ? "inactive" : ""
  return (
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <aside className="fixed bg-transparent text-white w-80 p-4 flex flex-col">
      
    <Link
      href={route("scanner_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("scanner_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
      >
        Barcode Scanner
    </Link>

    <Link
      href={route("search_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("search_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Barcode Search
    </Link>

    <select
      value={current}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${current
          ? "bg-white text-black border-white"
          : "bg-[#ff416c] text-white border-transparent"}`}
      onChange={(e) => {
        const value = e.target.value

        if (value === "available") {
          router.visit(route("items_page"))
        } else if (value === "broken") {
          router.visit(route("break_items_page"))
        } else if (value === "inactive") {
          router.visit(route("inactive_items_page"))
        }
      }}
    >
      <option value="">Select Items</option>
      <option value="available">Available Items</option>
      <option value="broken">Broken Items</option>
      <option value="inactive">Inactive Items</option>
    </select>

    {role === 'superadmin' && (
      <Link
      href={route("create_user_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("create_user_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Create User
    </Link>
    )}
  
    {role === 'superadmin' && (
      <Link
      href={route("requests_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Employee Requests
    </Link>
    )}

    {role === 'superadmin' && (
      <Link
      href={route("requests_audit_logs_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_audit_logs_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Audit Logs
    </Link>
    )}

    <Link
      href={route("requests_done_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_done_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Done Requests
    </Link>
  </aside>

  {/* Main content */}
  <div className="flex-1 p-4 ml-80">
    {children}
  </div>
</div>
  );
}