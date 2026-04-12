import { Link, usePage } from "@inertiajs/react"

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

function NavItem({ href, active, icon: Icon, children }) {
    return (
        <Link
            href={href}
            preserveScroll
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

    const isNewRequest = route().current("employee_page")
    const isMyRequests =
        route().current("employee_my_requests") || route().current("receipt_preview")
    const isProfile = route().current("employee_profile")

    return (
        <div className="flex min-h-screen">
            <aside className="fixed z-30 flex w-72 flex-col p-3 md:w-80">
                <div className="flex flex-1 flex-col rounded-2xl border border-white/15 bg-slate-900/55 p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
                    <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Employee</p>
                    <nav className="flex flex-col gap-1">
                        <NavItem href={route("employee_page")} active={isNewRequest} icon={IconPencil}>
                            New request
                        </NavItem>
                        <NavItem href={route("employee_my_requests")} active={isMyRequests} icon={IconInbox}>
                            My requests
                        </NavItem>
                        <NavItem href={route("employee_profile")} active={isProfile} icon={IconUser}>
                            Profile
                        </NavItem>
                    </nav>
                </div>
            </aside>

            <div className="ml-72 flex-1 p-4 md:ml-80">
                <div key={url} className="animate-pageEnter">
                    {children}
                </div>
            </div>
        </div>
    )
}
