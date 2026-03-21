import { Link, router } from "@inertiajs/react";
export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-black text-white w-80 p-4 flex flex-col">
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('scanner_page')}>Barcode Scanner</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('search_page')}>Barcode Search</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('items_page')}>Available Items</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('inactive_items_page')}>Inactive Items</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('create_user_page')}>Create User</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('requests_page')}>Employee requests</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('requests_done_page')}>Done requests</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('requests_audit_logs_page')}>Audit logs</Link>
        <button
          type="button"
          onClick={() => router.post(route('logout'))}
          className="bg-red-600 p-2 inline-block rounded-2xl m-2 hover:bg-red-900 text-left"
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