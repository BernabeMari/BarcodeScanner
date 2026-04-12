import UserAvatar from "@/Components/UserAvatar"
import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { formatBarcodes } from "@/utils/formatBarcodes"
import { router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"

export default function DoneRequests({ requests, filter, search, breakItems = [] }) {
    const page = usePage()
    const { url } = page
    const errors = page.props.errors
    const [searchTerm, setSearchTerm] = useState(search || "")

    useEffect(() => {
        setSearchTerm(search || "")
    }, [search])

    function setFilter(next) {
        router.get(
            route("requests_done_page"),
            { status: next, search: searchTerm },
            { preserveScroll: true, preserveState: true },
        )
    }

    function handleSearch(e) {
        e.preventDefault()
        router.get(
            route("requests_done_page"),
            { status: filter, search: searchTerm },
            { preserveScroll: true, preserveState: true },
        )
    }

    function clearSearch() {
        setSearchTerm("")
        router.get(
            route("requests_done_page"),
            { status: filter, search: "" },
            { preserveScroll: true, preserveState: true },
        )
    }

    return (
            <Layout>
                <SidebarLayout>
                    <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                        <h1 className="text-2xl font-semibold text-slate-900">Done requests</h1>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className={
                                    filter === "all"
                                        ? "bg-slate-800 text-white px-4 py-2 rounded-lg"
                                        : "bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300"
                                }
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("approved")}
                                className={
                                    filter === "approved"
                                        ? "bg-green-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-green-100 text-green-900 px-4 py-2 rounded-lg hover:bg-green-200"
                                }
                            >
                                Approved
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("issued")}
                                className={
                                    filter === "issued"
                                        ? "bg-blue-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-blue-100 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-200"
                                }
                            >
                                Issued
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("issuance_cancelled")}
                                className={
                                    filter === "issuance_cancelled"
                                        ? "bg-orange-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-orange-100 text-orange-900 px-4 py-2 rounded-lg hover:bg-orange-200"
                                }
                            >
                                Issuance Cancelled
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("rejected")}
                                className={
                                    filter === "rejected"
                                        ? "bg-red-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-red-100 text-red-900 px-4 py-2 rounded-lg hover:bg-red-200"
                                }
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {(errors?.status || errors?.allocation) && (
                        <div className="mb-4 text-red-200 text-sm">
                            {errors.status && <p>{Array.isArray(errors.status) ? errors.status[0] : errors.status}</p>}
                            {errors.allocation && (
                                <p>{Array.isArray(errors.allocation) ? errors.allocation[0] : errors.allocation}</p>
                            )}
                        </div>
                    )}

                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by Request ID..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Search
                            </button>
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {requests.length === 0 ? (
                        <p className="text-gray-500">No done requests yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {requests.map((req) => (
                                <li
                                    key={req.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div className="flex min-w-0 flex-1 gap-3">
                                            <UserAvatar user={req.user} className="h-12 w-12 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900">
                                                    {req.user?.username ?? "Unknown user"}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-0.5">
                                                    <span className="font-medium">Department:</span>{" "}
                                                    {req.user?.department?.trim()
                                                        ? req.user.department
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 shrink-0">
                                            Request ID:{" "}
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{req.id}</code>
                                        </p>
                                    </div>
                                    <div className="mt-3 text-gray-800">
                                        <span className="font-medium">Request type:</span> {req.request_type}
                                    </div>
                                    <div className="mt-2 text-gray-800">
                                        <span className="font-medium">Request:</span>
                                        <ul className="ml-4 list-disc mt-1">
                                            {Array.isArray(req.message) &&
                                                req.message.map((msg, index) => (
                                                    <li key={index}>
                                                        {msg} – {req.request_quantity?.[index]}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    {req.request_type === "single" && req.admin_break_allocations?.length > 0 && (
                                        <div className="mt-2 text-sm text-green-800 bg-green-50 rounded p-2">
                                            <span className="font-medium">Break allocation(s):</span>
                                            <ul className="list-disc pl-5 mt-1">
                                                {req.admin_break_allocations.map((line, i) => (
                                                    <li key={`${line.item_id}-${i}`}>
                                                        {line.product_name} — {line.quantity} piece(s) —{" "}
                                                        <code className="text-xs">{line.barcode}</code>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <p className="mt-2 text-sm">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span
                                            className={
                                                req.status === "approved"
                                                    ? "text-green-700"
                                                    : req.status === "issued"
                                                    ? "text-blue-700"
                                                    : req.status === "issuance_cancelled"
                                                    ? "text-orange-700"
                                                    : "text-red-700"
                                            }
                                        >
                                            {req.status === "issuance_cancelled" ? "Issuance Cancelled" : req.status}
                                        </span>
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Requested on {new Date(req.created_at).toLocaleString()}
                                    </p>

                                    {req.approved_at && (
                                        <p className="mt-1 text-xs text-green-700">
                                            Approved at{" "}
                                            {new Date(req.approved_at).toLocaleString()}
                                        </p>
                                    )}
                                    {req.rejected_at && (
                                        <p className="mt-1 text-xs text-red-700">
                                            Rejected at{" "}
                                            {new Date(req.rejected_at).toLocaleString()}
                                        </p>
                                    )}

                                    {req.issued_at && (
                                        <p className="mt-1 text-xs text-blue-700">
                                            Issued at{" "}
                                            {new Date(req.issued_at).toLocaleString()}
                                        </p>
                                    )}
                                    {req.issuance_cancelled_at && (
                                        <p className="mt-1 text-xs text-orange-700">
                                            Issuance cancelled at{" "}
                                            {new Date(req.issuance_cancelled_at).toLocaleString()}
                                        </p>
                                    )}

                                    {(req.verified_items?.length ?? 0) > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700">
                                                {req.request_type === "single" ? "Items / allocation:" : "Verified items:"}
                                            </p>
                                            <ul className="list-disc pl-5 mt-1">
                                                {req.verified_items.map((item) => (
                                                    <li key={`${item.barcode}-${item.product_name}`}>
                                                        {item.product_name}
                                                        {item.issued_quantity != null
                                                            ? ` — ${item.issued_quantity} piece(s)`
                                                            : ` (barcode ${item.barcode})`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}


                                    {req.status === "approved" && (
                                        <div className="mt-4 flex flex-col gap-2">
                                            {req.request_type === "single" &&
                                                !(req.admin_break_allocations?.length > 0) && (
                                                    <p className="text-sm text-amber-800">
                                                        Save a break item and piece count before marking issued.
                                                    </p>
                                                )}
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        req.request_type === "single" &&
                                                        !(req.admin_break_allocations?.length > 0)
                                                    }
                                                    onClick={() =>
                                                        router.post(route("mark_request_issued", req.id))
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Mark as Issued
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.post(route("cancel_request_issuance", req.id))
                                                    }
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
                                                >
                                                    Cancel Issuance
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </SidebarLayout>
            </Layout>
    )
}

