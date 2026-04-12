import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"
import { router } from "@inertiajs/react"
import { useEffect, useMemo, useState, useCallback } from "react"

function barcodeSlotActive(item, index) {
    if (Array.isArray(item.statuses) && item.statuses[index] !== undefined) {
        return item.statuses[index] !== "inactive"
    }
    return item.status === "active"
}

function IconMagnifyingGlass({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    )
}

function IconQr({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.5v4.5m0 6v4.5M4.5 3.75h4.5m6 0h4.5M19.5 20.25h-4.5m-6 0H4.5M20.25 19.5v-4.5m0-6V4.5M9 9h6v6H9V9z"
            />
        </svg>
    )
}

function IconGrid({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
        </svg>
    )
}

function IconTrendDown({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
        </svg>
    )
}

function IconTrendUp({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.286 4.286a11.948 11.948 0 0 0 4.306-6.43l.776-2.898m0 0 3.182 5.511m-3.182-5.51-5.511 3.182" />
        </svg>
    )
}

function IconBolt({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 14.25 2.25 12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
    )
}

function IconLayers({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.429 9.75 2.25 12l4.179 2.25m8.642-4.5L21.75 12l-4.179 2.25m0 0L12 16.5l-5.571-2.25M6.429 9.75 12 7.5l5.571 2.25M6.429 9.75v5.25L12 17.25m0-9.75 5.571 2.25M12 17.25v-5.25m0 0-5.571-2.25"
            />
        </svg>
    )
}

function FilterBtn({ active, onClick, icon: Icon, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200",
                active
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 ring-2 ring-amber-200/80"
                    : "border border-slate-200 bg-white text-slate-800 hover:border-amber-200 hover:bg-amber-50/90",
            ].join(" ")}
        >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-slate-900" : "text-slate-600"}`} />
            {children}
        </button>
    )
}

export default function ItemsPage({ items, searchMeta = {} }) {
    const { q = "", barcode: barcodeParam = "", error = null, searchByQuery = false } = searchMeta

    const [showAllItem, showAllItemState] = useState(true)
    const [showLowItem, showLowItemState] = useState(false)
    const [showHighItem, showHighItemState] = useState(false)
    const [showSingleItem, showSingleItemState] = useState(false)
    const [showMultipleItem, showMultipleItemState] = useState(false)
    const [pendingBreak, setPendingBreak] = useState(null)

    const [nameQuery, setNameQuery] = useState(q)
    const [barcodeDraft, setBarcodeDraft] = useState(barcodeParam || "")

    useEffect(() => {
        setNameQuery(q)
        setBarcodeDraft(barcodeParam || "")
    }, [q, barcodeParam])

    const catalogItems = useMemo(
        () => items.filter((item) => item.status === "active"),
        [items],
    )

    const visibleItems = useMemo(() => {
        if (showAllItem) {
            return catalogItems
        }
        if (showLowItem) {
            return catalogItems.filter((item) => item.quantity_pack <= 30)
        }
        if (showHighItem) {
            return catalogItems.filter((item) => item.quantity_pack >= 30)
        }
        if (showSingleItem) {
            return catalogItems.filter((item) => item.break === "break")
        }
        if (showMultipleItem) {
            return catalogItems.filter((item) => item.break === "not_break")
        }
        return catalogItems
    }, [catalogItems, showAllItem, showLowItem, showHighItem, showSingleItem, showMultipleItem])

    const showInactiveSlots = Boolean(searchByQuery)
    const hasServerSearch = Boolean((q && q.length > 0) || (barcodeParam && String(barcodeParam).length > 0))

    const PER_PAGE = 10

    const slotRows = useMemo(() => {
        const rows = []
        for (const item of visibleItems) {
            const codes = Array.isArray(item.barcode)
                ? item.barcode.filter((c) => c != null && String(c).trim() !== "")
                : []
            codes.forEach((code, idx) => {
                const slotActive = barcodeSlotActive(item, idx)
                if (!showInactiveSlots && !slotActive) {
                    return
                }
                rows.push({
                    key: `${item.id}-${code}-${idx}`,
                    item,
                    code,
                    idx,
                    slotActive,
                })
            })
        }
        return rows
    }, [visibleItems, showInactiveSlots])

    const [listPage, setListPage] = useState(1)

    useEffect(() => {
        setListPage(1)
    }, [items, q, barcodeParam, showAllItem, showLowItem, showHighItem, showSingleItem, showMultipleItem])

    const totalListPages = Math.max(1, Math.ceil(slotRows.length / PER_PAGE))
    const safeListPage = Math.min(listPage, totalListPages)
    const listStart = (safeListPage - 1) * PER_PAGE
    const paginatedSlots = slotRows.slice(listStart, listStart + PER_PAGE)

    useEffect(() => {
        if (listPage > totalListPages) {
            setListPage(totalListPages)
        }
    }, [listPage, totalListPages])

    const goListPage = useCallback((next) => {
        setListPage(() => {
            const tp = Math.max(1, Math.ceil(slotRows.length / PER_PAGE))
            return Math.min(Math.max(1, next), tp)
        })
    }, [slotRows.length])

    function confirmBreak() {
        if (!pendingBreak) {
            return
        }
        router.post(
            route("split_barcode_break", pendingBreak.id),
            { barcode: pendingBreak.barcode },
            {
                preserveScroll: true,
                onFinish: () => setPendingBreak(null),
            },
        )
    }

    function submitNameSearch(e) {
        e.preventDefault()
        const term = nameQuery.trim()
        if (!term) {
            return
        }
        router.get(route("items_page"), { q: term }, { preserveScroll: true })
    }

    function submitBarcodeSearch(e) {
        e.preventDefault()
        const term = barcodeDraft.trim()
        if (!term) {
            return
        }
        router.get(route("items_page"), { barcode: term }, { preserveScroll: true })
    }

    function clearInventorySearch() {
        showAllItemState(true)
        showLowItemState(false)
        showHighItemState(false)
        showMultipleItemState(false)
        showSingleItemState(false)
        setNameQuery("")
        setBarcodeDraft("")
        router.get(route("items_page"), {}, { preserveScroll: true })
    }

    function resetFiltersOnly() {
        showAllItemState(true)
        showLowItemState(false)
        showHighItemState(false)
        showMultipleItemState(false)
        showSingleItemState(false)
    }

    return (
            <Layout>
                <SidebarLayout>
                    <div>
                        <h1 className="mb-4 text-2xl font-bold tracking-tight text-white drop-shadow-md">Available items</h1>

                        <div className="mb-6 rounded-2xl border border-white/15 bg-slate-900/40 p-4 shadow-lg backdrop-blur-md">
                            <p className="mb-3 text-sm text-white/70">Search inventory by product name, exact barcode, or scanner-style entry.</p>
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
                                <form onSubmit={submitNameSearch} className="flex flex-1 flex-wrap items-end gap-2">
                                    <div className="min-w-[200px] flex-1">
                                        <label className="mb-1 block text-xs font-medium text-white/60">Name or exact barcode</label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                                <IconMagnifyingGlass />
                                            </span>
                                            <input
                                                type="search"
                                                value={nameQuery}
                                                onChange={(e) => setNameQuery(e.target.value)}
                                                placeholder="Product name…"
                                                className="w-full rounded-xl border border-white/20 bg-black/30 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none ring-amber-400/0 transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-amber-400"
                                    >
                                        <IconMagnifyingGlass className="h-4 w-4" />
                                        Search
                                    </button>
                                </form>
                                <form onSubmit={submitBarcodeSearch} className="flex flex-wrap items-end gap-2 lg:border-l lg:border-white/15 lg:pl-4">
                                    <div className="min-w-[180px] flex-1">
                                        <label className="mb-1 block text-xs font-medium text-white/60">Scan / type barcode</label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                                <IconQr />
                                            </span>
                                            <input
                                                type="text"
                                                value={barcodeDraft}
                                                onChange={(e) => setBarcodeDraft(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        submitBarcodeSearch(e)
                                                    }
                                                }}
                                                placeholder="Barcode…"
                                                className="w-full rounded-xl border border-white/20 bg-black/30 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25"
                                    >
                                        <IconQr className="h-4 w-4" />
                                        Find
                                    </button>
                                </form>
                            </div>
                            {hasServerSearch && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
                                    <span className="rounded-full bg-white/10 px-3 py-1">
                                        {q ? `Name search: “${q}”` : null}
                                        {barcodeParam ? `Barcode: ${barcodeParam}` : null}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={clearInventorySearch}
                                        className="rounded-full border border-white/25 px-3 py-1 font-medium text-white/90 transition hover:bg-white/10"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                            {error && (
                                <p className="mt-3 rounded-lg border border-red-400/40 bg-red-950/50 px-3 py-2 text-sm text-red-100">
                                    {error}
                                </p>
                            )}
                            {searchByQuery && (
                                <p className="mt-2 text-xs text-amber-100/90">
                                    Text search includes inactive barcode slots so you can see depleted lines.
                                </p>
                            )}
                        </div>

                        <div className="mb-6 flex flex-wrap justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/35 p-3 shadow-inner backdrop-blur-sm md:justify-start">
                            <FilterBtn
                                active={showAllItem}
                                onClick={() => {
                                    resetFiltersOnly()
                                    showAllItemState(true)
                                }}
                                icon={IconGrid}
                            >
                                All items
                            </FilterBtn>
                            <FilterBtn
                                active={showLowItem}
                                onClick={() => {
                                    showLowItemState(true)
                                    showAllItemState(false)
                                    showHighItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(false)
                                }}
                                icon={IconTrendDown}
                            >
                                Low stock
                            </FilterBtn>
                            <FilterBtn
                                active={showHighItem}
                                onClick={() => {
                                    showHighItemState(true)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(false)
                                }}
                                icon={IconTrendUp}
                            >
                                High stock
                            </FilterBtn>
                            <FilterBtn
                                active={showSingleItem}
                                onClick={() => {
                                    showHighItemState(false)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(true)
                                }}
                                icon={IconBolt}
                            >
                                Single (break)
                            </FilterBtn>
                            <FilterBtn
                                active={showMultipleItem}
                                onClick={() => {
                                    showHighItemState(false)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(true)
                                    showSingleItemState(false)
                                }}
                                icon={IconLayers}
                            >
                                Multiple (packs)
                            </FilterBtn>
                        </div>

                        <div>
                            {slotRows.length === 0 ? (
                                <p className="text-white/75">No barcode rows match the current filters or search.</p>
                            ) : (
                                <>
                                    {paginatedSlots.map(({ key, item, code, idx, slotActive }) => (
                                        <div
                                            key={key}
                                            className="mb-2 rounded-xl border border-gray-200/90 bg-white p-1 shadow-sm"
                                        >
                                            <div className="flex flex-col justify-between gap-3 rounded-lg border border-gray-100 bg-white p-4 sm:flex-row sm:items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800">Product:</span>{" "}
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800">Barcode:</span>{" "}
                                                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{code}</code>
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800">Qty / pack:</span>{" "}
                                                        {item.quantity_pack}
                                                        <span className="mx-2 text-gray-300">|</span>
                                                        <span className="font-medium text-gray-800">Qty / piece:</span>{" "}
                                                        {item.quantity_piece}
                                                    </p>
                                                    <p className="mt-1 flex flex-wrap gap-2 text-xs">
                                                        <span
                                                            className={
                                                                item.break === "break"
                                                                    ? "rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900"
                                                                    : "rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-800"
                                                            }
                                                        >
                                                            {item.break === "break" ? "Break item" : "Regular"}
                                                        </span>
                                                        {showInactiveSlots && (
                                                            <span
                                                                className={
                                                                    slotActive
                                                                        ? "rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-900"
                                                                        : "rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700"
                                                                }
                                                            >
                                                                {slotActive ? "Slot active" : "Slot inactive"}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                {item.break === "not_break" && slotActive && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingBreak({ id: item.id, barcode: code })}
                                                        className="shrink-0 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-red-600 hover:to-rose-700"
                                                    >
                                                        Break
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {totalListPages > 1 && (
                                        <nav
                                            className="mt-6 flex flex-col items-stretch gap-3 rounded-2xl border border-white/15 bg-slate-900/40 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
                                            aria-label="Inventory pagination"
                                        >
                                            <p className="text-center text-sm text-white/85 sm:text-left">
                                                Showing{" "}
                                                <span className="font-semibold text-white">
                                                    {listStart + 1}–{Math.min(listStart + PER_PAGE, slotRows.length)}
                                                </span>{" "}
                                                of <span className="font-semibold text-white">{slotRows.length}</span>{" "}
                                                rows
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={safeListPage <= 1}
                                                    onClick={() => goListPage(safeListPage - 1)}
                                                    className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Previous
                                                </button>
                                                <span className="px-2 text-sm font-medium text-white/90">
                                                    Page {safeListPage} / {totalListPages}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={safeListPage >= totalListPages}
                                                    onClick={() => goListPage(safeListPage + 1)}
                                                    className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </nav>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {pendingBreak && (
                        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
                            <div className="w-auto max-w-md rounded-3xl bg-slate-700 p-6 text-white shadow-xl">
                                <p className="mb-4">
                                    Move barcode{" "}
                                    <code className="rounded bg-slate-900 px-1.5 py-0.5">{pendingBreak.barcode}</code> to break
                                    items?{" "}
                                    {visibleItems.find((i) => i.id === pendingBreak.id)?.barcode?.length === 1
                                        ? "The whole product row will move to Break Items."
                                        : "This barcode will be split into its own break line."}
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setPendingBreak(null)}
                                        className="rounded-2xl bg-green-600 px-6 py-3 transition hover:bg-green-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmBreak}
                                        className="rounded-2xl bg-red-600 px-6 py-3 transition hover:bg-red-500"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </SidebarLayout>
            </Layout>
    )
}
