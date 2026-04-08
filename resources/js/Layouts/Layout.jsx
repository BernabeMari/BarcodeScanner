import { usePage } from "@inertiajs/react";

export default function Layout({ children }) {
  const { auth } = usePage().props;
  console.log(auth.user.id)
  return (
    <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] fixed top-0 left-0 w-full text-white h-20 font-bold p-4 z-50 flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="/images/tcu-logo.jpg" 
          alt="TCU Logo" 
          className="w-12 h-12 rounded-full" 
        />
        <div className="ml-4 flex flex-col">
          <h1 className="text-2xl italic">Taguig City University</h1>
          <p className="text-sm font-normal italic">
            Transforming Excellence into Purpose
          </p>
        </div>
      </div>

      <div className="ml-auto">
       
          <img
            src={`/storage/${auth.user.profile_picture}`}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
       
      </div>
    </header>

    {/* Main content */}
    <main className="flex-1 pt-20 min-h-screen flex flex-col">
      {children}
    </main>

    {/* Footer */}
    <footer className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white h-16 flex items-center justify-center text-lg font-semibold">
      © {new Date().getFullYear()} Taguig City University — All rights reserved
    </footer>
    </div>
  );
}

