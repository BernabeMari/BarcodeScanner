import { Link, usePage } from "@inertiajs/react"
import { useState } from "react"

function IconScanner({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.5v4.5m0 6v4.5M4.5 3.75h4.5m6 0h4.5M19.5 20.25h-4.5m-6 0H4.5M20.25 19.5v-4.5m0-6V4.5M9 9h6v6H9V9z"
            />
        </svg>
    )
}

function IconCube({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5v9l9 5.25M12 12l9-5.25M12 12v9m0-9L3 6.75"
            />
        </svg>
    )
}

function IconBolt({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 14.25 2.25 12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
    )
}

function IconArchive({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
        </svg>
    )
}

function IconUserPlus({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
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

function IconClipboard({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664M6.75 7.5H6v12h12v-12h-.75m-13.5-3h13.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 6 4.5Z"
            />
        </svg>
    )
}

function IconCheck({ className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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

function IconXMark({ className = "h-5 w-5" }) {
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

export default function SidebarLayout({ children }) {
    const { props, url } = usePage()
    const role = props.auth.user.role
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const closeNav = () => setMobileNavOpen(false)

    const isScanner = route().current("scanner_page")
    const isItems = route().current("items_page")
    const isBreak = route().current("break_items_page")
    const isInactive = route().current("inactive_items_page")
    const isCreateUser = route().current("create_user_page")
    const isRequests = route().current("requests_page")
    const isAudit = route().current("requests_audit_logs_page")
    const isDone = route().current("requests_done_page")

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
                        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Navigation</p>
                        <button
                            type="button"
                            onClick={closeNav}
                            className="rounded-lg p-2 text-white/90 hover:bg-white/10"
                            aria-label="Close menu"
                        >
                            <IconXMark />
                        </button>
                    </div>
                    <p className="mb-3 hidden px-2 text-xs font-semibold uppercase tracking-wider text-white/50 lg:block">Navigation</p>
                    <nav className="flex flex-col gap-1">
                        <NavItem href={route("scanner_page")} active={isScanner} icon={IconScanner} onNavigate={closeNav}>
                            Barcode scanner
                        </NavItem>

                        <p className="mt-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Inventory</p>
                        <NavItem href={route("items_page")} active={isItems} icon={IconCube} onNavigate={closeNav}>
                            Available items
                        </NavItem>
                        <NavItem href={route("break_items_page")} active={isBreak} icon={IconBolt} onNavigate={closeNav}>
                            Break items
                        </NavItem>
                        <NavItem href={route("inactive_items_page")} active={isInactive} icon={IconArchive} onNavigate={closeNav}>
                            Inactive items
                        </NavItem>

                        {role === "superadmin" && (
                            <>
                                <p className="mt-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Admin</p>
                                <NavItem href={route("create_user_page")} active={isCreateUser} icon={IconUserPlus} onNavigate={closeNav}>
                                    Create user
                                </NavItem>
                                <NavItem href={route("requests_page")} active={isRequests} icon={IconInbox} onNavigate={closeNav}>
                                    Employee requests
                                </NavItem>
                                <NavItem href={route("requests_audit_logs_page")} active={isAudit} icon={IconClipboard} onNavigate={closeNav}>
                                    Audit logs
                                </NavItem>
                            </>
                        )}

                        <p className="mt-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">Requests</p>
                        <NavItem href={route("requests_done_page")} active={isDone} icon={IconCheck} onNavigate={closeNav}>
                            Done requests
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
