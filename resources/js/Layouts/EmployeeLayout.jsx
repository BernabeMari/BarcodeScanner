import { Link, usePage } from "@inertiajs/react"
import { useState } from "react"

function IconPencil({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 0 20.25 21h-15A2.25 2.25 0 0 0 3 18.75V8.25A2.25 2.25 0 0 0 5.25 6H10"
            />
        </svg>
    )
}

function IconInbox({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 0 0 2.012-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.218a2.25 2.25 0 0 1 2.013 1.244l.256.512a2.25 2.25 0 0 0 2.012 1.244H21.75M2.25 13.5v3.75A2.25 2.25 0 0 0 4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V13.5M8.23 10.23l2.25-2.25m0 0 2.25-2.25M10.5 8.25 12.75 6m0 0 2.25 2.25M12.75 6l2.25 2.25"
            />
        </svg>
    )
}

function IconUser({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
        </svg>
    )
}

function IconBars({ className = "h-6 w-6" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    )
}

function IconXMark({ className = "h-6 w-6" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    )
}

function NavItem({ href, active, icon: Icon, children, onNavigate }) {
    return (
        <Link
            href={href}
            preserveScroll
            onClick={() => onNavigate?.()}
            className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-all duration-200 ease-out",
                "border border-transparent",
                active
                    ? "translate-x-0 bg-white/20 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm"
                    : "text-white/90 hover:translate-x-1 hover:border-white/20 hover:bg-white/10 hover:shadow-md active:scale-[0.98]",
            ].join(" ")}
        >
            <span
                className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    active
                        ? "bg-gradient-to-br from-amber-200 to-orange-400 text-slate-900 shadow-inner"
                        : "bg-white/10 text-white group-hover:bg-white/20",
                ].join(" ")}
            >
                <Icon className="h-5 w-5" />
            </span>
            <span className="truncate">{children}</span>
        </Link>
    )
}

export default function EmployeeLayout({ children }) {
    const { url } = usePage()
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    const isNewRequest = route().current("employee_page")
    const isMyRequests =
        route().current("employee_my_requests") || route().current("receipt_preview")
    const isProfile = route().current("employee_profile")

    const closeNav = () => setMobileNavOpen(false)

    return (
        <div className="relative flex min-h-screen">
            {mobileNavOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-black/45 lg:hidden"
                    style={{ top: "5.25rem" }}
                    onClick={closeNav}
                />
            )}

            <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="fixed left-3 z-[45] flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-slate-900/90 text-white shadow-lg backdrop-blur-sm lg:hidden"
                style={{ top: "5.75rem" }}
                aria-label="Open menu"
            >
                <IconBars />
            </button>

            <aside
                className={[
                    "fixed bottom-0 left-0 top-[5.25rem] z-50 flex w-[min(18rem,88vw)] flex-col p-3 transition-transform duration-200 ease-out lg:z-30 lg:w-80 lg:translate-x-0",
                    mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div className="flex max-h-[calc(100vh-6rem)] flex-1 flex-col overflow-y-auto rounded-2xl border border-white/15 bg-slate-900/55 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
                    <div className="mb-2 flex items-center justify-between gap-2 lg:hidden">
                        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Employee</p>
                        <button
                            type="button"
                            onClick={closeNav}
                            className="rounded-lg p-2 text-white/90 hover:bg-white/10"
                            aria-label="Close menu"
                        >
                            <IconXMark className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="mb-3 hidden px-2 text-xs font-semibold uppercase tracking-wider text-white/50 lg:block">Employee</p>
                    <nav className="flex flex-col gap-1">
                        <NavItem href={route("employee_page")} active={isNewRequest} icon={IconPencil} onNavigate={closeNav}>
                            New request
                        </NavItem>
                        <NavItem href={route("employee_my_requests")} active={isMyRequests} icon={IconInbox} onNavigate={closeNav}>
                            My requests
                        </NavItem>
                        <NavItem href={route("employee_profile")} active={isProfile} icon={IconUser} onNavigate={closeNav}>
                            Profile
                        </NavItem>
                    </nav>
                </div>
            </aside>

            <div className="min-w-0 flex-1 p-3 pt-14 sm:p-4 lg:ml-80 lg:pt-4">
                <div key={url} className="animate-pageEnter">
                    {children}
                </div>
            </div>
        </div>
    )
}
