export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-red-800 fixed top-0 left-0 w-full text-white h-20 font-bold text-left p-4 text-3xl z-50">
        Taguig City University
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-red-800 text-white h-10 text-center text-3xl">
        All rights reserved
      </footer>
    </div>
  );
}

