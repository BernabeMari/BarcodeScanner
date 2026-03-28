import { Link, router } from "@inertiajs/react";
export default function SidebarLayout({ children }) {
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

    <Link
      href={route("items_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("items_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Available Items
    </Link>
    
    <Link
      href={route("break_items_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("break_items_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Broken Items
    </Link>

    <Link
      href={route("inactive_items_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("inactive_items_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Inactive Items
    </Link>

    <Link
      href={route("create_user_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("create_user_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Create User
    </Link>

    <Link
      href={route("requests_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Employee Requests
    </Link>

    <Link
      href={route("requests_audit_logs_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_audit_logs_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Audit Logs
    </Link>

    <Link
      href={route("requests_done_page")}
      className={`p-2 inline-block rounded-xl m-2 border transition opacity-70
        ${route().current("requests_done_page")
          ? "bg-gradient-to-r from-white to-[#ff4b2b] text-black font-semibold border-white"
          : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent hover:border-white"}`}
    >
      Done Requests
    </Link>

    <button
      type="button"
      onClick={() => router.post(route("logout"))}
      className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] p-2 inline-block rounded-xl m-2 border border-transparent hover:border-white transition text-left opacity-70"
    >
      Logout
    </button>
  </aside>

  {/* Main content */}
  <div className="flex-1 p-4 ml-80">
    {children}
  </div>
</div>
  );
}