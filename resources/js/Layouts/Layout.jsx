import { usePage, router } from "@inertiajs/react"
import { useState } from "react"

export default function Layout({ children }) {
    const { auth } = usePage().props
    const user = auth?.user
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const avatarSrc =
        user?.profile_picture != null && String(user.profile_picture).trim() !== ""
            ? `/storage/${user.profile_picture}`
            : null

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <header className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] fixed top-0 left-0 w-full text-white min-h-[5rem] font-bold p-4 z-50 flex items-center justify-between shadow-md">
                <div className="flex items-center min-w-0">
                    <img src="/images/tcu-logo.jpg" alt="TCU Logo" className="w-12 h-12 rounded-full shrink-0 ring-2 ring-white/30" />
                    <div className="ml-4 flex flex-col min-w-0">
                        <h1 className="text-xl sm:text-2xl italic truncate">Taguig City University</h1>
                        <p className="text-xs sm:text-sm font-normal italic truncate opacity-95">
                            Transforming Excellence into Purpose
                        </p>
                    </div>
                </div>

                <div className="ml-auto relative shrink-0">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt=""
                            className="w-12 h-12 rounded-full cursor-pointer border-2 border-white object-cover"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/20 text-sm font-semibold uppercase"
                            aria-label="Account menu"
                        >
                            {(user?.username ?? "?").slice(0, 2)}
                        </button>
                    )}

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/20 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] py-1 text-white shadow-lg z-50">
                            <button
                                type="button"
                                onClick={() => router.post(route("logout"))}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-white/15 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 pt-[5.25rem] min-h-screen flex flex-col">{children}</main>

            <footer className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white py-4 flex items-center justify-center text-center text-sm sm:text-base font-semibold px-4">
                © {new Date().getFullYear()} Taguig City University — All rights reserved
            </footer>
        </div>
    )
}
