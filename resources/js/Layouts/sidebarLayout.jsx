import { Link } from "@inertiajs/react";
export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-black text-white w-80 p-4 flex flex-col">
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('scanner_page')}>Barcode Scanner</Link>
        <Link className="bg-red-400 p-2 inline-block rounded-2xl m-2 hover:bg-red-800" href={route('items_page')}>Items</Link>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}