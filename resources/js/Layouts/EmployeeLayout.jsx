import { Link, router } from "@inertiajs/react";
export default function SidebarLayoutEmployee({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed linear-gradient(to right, #ff416c, #ff4b2b) text-white w-80 p-4 flex flex-col">
        <Link href={route("employee_page")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("employee_page")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
        >
        New Request
        </Link>

        
        <Link href={route("employee_my_requests")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("employee_my_requests")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
        >
        My Requests
        </Link>

        <Link href={route("employee_profile")} className={`p-2 inline-block rounded-xl m-2 border transition
    ${route().current("employee_profile")
      ? "bg-gradient-to-r from-[#ffffff] to-[#ff4b2b] text-black font-semibold border-white"
      : "linear-gradient(to right, #ff416c, #ff4b2b) border-transparent hover:border-white"}`}
        >
        Profile
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 ml-80">
        {children}
      </div>
    </div>
  );
}