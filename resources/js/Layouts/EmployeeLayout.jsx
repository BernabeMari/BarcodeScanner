import { Link, router } from "@inertiajs/react";
export default function SidebarLayoutEmployee({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-black text-white w-80 p-4 flex flex-col gap-2">
        <Link className="bg-blue-500 p-2 rounded-lg hover:bg-blue-700" href={route('employee_page')}>
          New request
        </Link>
        <Link className="bg-blue-500 p-2 rounded-lg hover:bg-blue-700" href={route('employee_my_requests')}>
          My requests
        </Link>
        <button
          type="button"
          onClick={() => router.post(route('logout'))}
          className="bg-red-500 p-2 rounded-lg hover:bg-red-700 text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}