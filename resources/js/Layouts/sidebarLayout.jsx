import { Link, router } from "@inertiajs/react";
export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed linear-gradient(to right, #ff416c, #ff4b2b) text-white w-80 p-4 flex flex-col">


<Link href={route("scanner_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("scanner_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>
  Barcode Scanner
</Link>


<Link href={route("search_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("search_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>Barcode Search
</Link>


<Link href={route("items_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("items_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>Available Items
</Link>


<Link href={route("inactive_items_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("inactive_items_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>Inactive Items
</Link>


<Link href={route("create_user_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("create_user_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>Create User
</Link>


<Link href={route("requests_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("requests_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>
  Employee requests
</Link>


<Link href={route("requests_audit_logs_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("requests_audit_logs_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>
  Audit logs
</Link>


<Link href={route("requests_done_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("requests_done_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
>
  Done requests
</Link>
        <button
          type="button"
          onClick={() => router.post(route('logout'))}
          className="linear-gradient(to right, #ff416c, #ff4b2b) p-2 inline-block rounded-xl m-2 border border-transparent hover:border-white transition text-left"
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