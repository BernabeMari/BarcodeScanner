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
            <header className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] fixed top-0 left-0 w-full text-white min-h-[5rem] font-bold z-50 flex items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4 shadow-md">
                <div className="flex min-w-0 flex-1 items-center">
                    <img
                        src="/images/tcu-logo.jpg"
                        alt="TCU Logo"
                        className="h-10 w-10 shrink-0 rounded-full ring-2 ring-white/30 sm:h-12 sm:w-12"
                    />
                    <div className="ml-2 flex min-w-0 flex-col sm:ml-4">
                        <h1 className="truncate text-base italic sm:text-xl md:text-2xl">Taguig City University</h1>
                        <p className="truncate text-[10px] font-normal italic opacity-95 sm:text-xs md:text-sm">
                            Transforming Excellence into Purpose
                        </p>
                    </div>
                </div>

                <div className="relative shrink-0">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt=""
                            className="h-10 w-10 cursor-pointer rounded-full border-2 border-white object-cover sm:h-12 sm:w-12"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/20 text-xs font-semibold uppercase sm:h-12 sm:w-12 sm:text-sm"
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
