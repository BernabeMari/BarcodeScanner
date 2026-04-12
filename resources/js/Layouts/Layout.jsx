import TcuPageBackground from "@/Components/TcuPageBackground"
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
        <div className="relative flex min-h-screen flex-col">
            <TcuPageBackground />
            <header className="fixed left-0 top-0 z-50 flex min-h-[5rem] w-full items-center justify-between gap-2 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-3 py-3 font-bold text-white shadow-md sm:px-4 sm:py-4">
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
                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-white/25 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => router.post(route("logout"))}
                                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm ring-2 ring-white/40 transition hover:from-amber-300 hover:to-orange-400"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="relative z-10 flex min-h-screen flex-1 flex-col pt-[5.25rem]">{children}</main>

            <footer className="relative z-50 flex items-center justify-center bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-4 py-4 text-center text-sm font-semibold text-white sm:text-base">
                © {new Date().getFullYear()} Taguig City University — All rights reserved
            </footer>
        </div>
    )
}
