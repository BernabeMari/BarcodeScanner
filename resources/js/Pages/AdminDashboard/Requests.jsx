import UserAvatar from "@/Components/UserAvatar"
import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { formatBarcodes } from "@/utils/formatBarcodes"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"

export default function Requests({ requests, breakItems = [] }) {
    const { errors, flash } = usePage().props
    const [barcodes, setBarcodes] = useState({})
    const [messages, setMessages] = useState({})
    const [allocItemId, setAllocItemId] = useState({})
    const [allocQty, setAllocQty] = useState({})
    const [breakItemFilter, setBreakItemFilter] = useState({})

    function setBarcodeFor(id, value) {
        setBarcodes((prev) => ({ ...prev, [id]: value }))
    }

    function setMessageFor(id, value) {
        setMessages((prev) => ({ ...prev, [id]: value }))
    }

    function setAllocItemFor(id, value) {
        setAllocItemId((prev) => ({ ...prev, [id]: value }))
    }

    function setAllocQtyFor(id, value) {
        setAllocQty((prev) => ({ ...prev, [id]: value }))
    }

    function setBreakItemFilterFor(id, value) {
        setBreakItemFilter((prev) => ({ ...prev, [id]: value }))
    }

    function filteredBreakItems(req) {
        const reqId = req.id
        const term = (breakItemFilter[reqId] ?? "").trim().toLowerCase()
        const allocatedIds = new Set(
            (req.admin_break_allocations ?? [])
                .map((line) => String(line.item_id ?? ""))
                .filter((id) => id !== "" && id !== "0"),
        )
        let items = breakItems.filter((item) => !allocatedIds.has(String(item.id)))
        if (term) {
            items = items.filter((item) => {
                const name = (item.product_name ?? "").toLowerCase()
                const codes = Array.isArray(item.barcode) ? item.barcode.join(" ").toLowerCase() : ""
                return name.includes(term) || codes.includes(term)
            })
        }
        return items
    }

    function currentAllocItemId(req) {
        if (Object.prototype.hasOwnProperty.call(allocItemId, req.id)) {
            return allocItemId[req.id]
        }
        return ""
    }

    function currentAllocQty(req) {
        if (Object.prototype.hasOwnProperty.call(allocQty, req.id)) {
            return allocQty[req.id]
        }
        return ""
    }

    function verifyItem(requestId) {
        const barcode = (barcodes[requestId] ?? "").trim()
        if (!barcode) {
            return
        }
        router.post(
            route("verify_request_item", requestId),
            { barcode },
            {
                preserveScroll: true,
                onSuccess: () => setBarcodeFor(requestId, ""),
            },
        )
    }

    function updateRequest(id, status) {
        const message = (messages[id] ?? "").trim()
        router.post(route("update_request", id), { status, message }, { preserveScroll: true })
    }

    function removeVerifiedItem(requestId, barcode) {
        router.post(route("remove_verified_item", requestId), { barcode }, { preserveScroll: true })
    }

    function saveBreakAllocationFor(req) {
        const item_id = currentAllocItemId(req)
        const quantity = currentAllocQty(req)
        router.post(
            route("save_break_allocation", req.id),
            { item_id, quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAllocItemFor(req.id, "")
                    setAllocQtyFor(req.id, "")
                },
            },
        )
    }

    function removeBreakAllocationLine(reqId, index) {
        router.post(
            route("remove_break_allocation_line", reqId),
            { index },
            { preserveScroll: true },
        )
    }

    return (
            <Layout>
                <SidebarLayout>
                    <h1 className="mb-4 text-2xl font-semibold text-white drop-shadow-md">Employee requests</h1>
                    <p className="mb-2 text-sm text-white/85 sm:text-base">
                        <strong>Multiple:</strong> scan regular inventory (break items cannot be scanned).
                        <br />
                        <strong>Single:</strong> add one or more break lines (product + pieces), then approve — stock is deducted on approve. <strong>Mark as issued</strong> also marks break barcodes inactive when that line is fully depleted (so they no longer appear as available on Available Items).
                    </p>
                    {flash?.success && <p className="mb-4 text-green-700 text-sm">{flash.success}</p>}
                    {errors?.barcode && <p className="mb-4 text-red-600 text-sm">{errors.barcode}</p>}
                    {errors?.status && <p className="mb-4 text-red-600 text-sm">{errors.status}</p>}
                    {errors?.allocation && (
                        <p className="mb-4 text-red-600 text-sm">
                            {Array.isArray(errors.allocation) ? errors.allocation[0] : errors.allocation}
                        </p>
                    )}

                    {requests.length === 0 ? (
                        <p className="text-white/75">No requests yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {requests.map((req) => (
                                <li key={req.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex gap-4 border-b border-slate-100 pb-4 mb-4">
                                        <UserAvatar user={req.user} className="h-14 w-14 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900">
                                                {req.user?.username ?? "Unknown user"}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                <span className="font-medium">Department:</span>{" "}
                                                {req.user?.department?.trim() ? req.user.department : "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 mt-1">
                                        <span className="font-medium">Request type:</span> ({req.request_type})
                                    </p>
                                    <p className="text-gray-800 mt-2">
                                        <span className="font-medium">Employee request:</span>
                                        <ul className="ml-4 list-disc mt-1">
                                            {Array.isArray(req.message) &&
                                                req.message.map((msg, index) => (
                                                    <li key={index}>
                                                        {msg} – {req.request_quantity?.[index]}
                                                    </li>
                                                ))}
                                        </ul>
                                    </p>

                                    {req.request_type === "single" && req.admin_break_allocations?.length > 0 && (
                                        <div className="mt-2 text-sm text-green-800 bg-green-50 rounded p-2 space-y-1">
                                            <span className="font-medium">Saved break allocation(s):</span>
                                            <ul className="list-disc pl-5 mt-1">
                                                {req.admin_break_allocations.map((line, lineIdx) => (
                                                    <li key={`${line.item_id}-${lineIdx}`}>
                                                        {line.product_name} — {line.quantity} piece(s) — barcode{" "}
                                                        <code className="text-xs">{line.barcode}</code>
                                                        {req.status === "pending" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeBreakAllocationLine(req.id, lineIdx)}
                                                                className="ml-2 text-xs text-red-600 hover:text-red-800 underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
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
                                                    : req.status === "rejected"
                                                      ? "text-red-700"
                                                      : "text-amber-700"
                                            }
                                        >
                                            {req.status}
                                        </span>
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Requested on {new Date(req.created_at).toLocaleString()}
                                    </p>

                                    {req.request_type === "multiple" && (req.verified_items?.length ?? 0) > 0 && (
                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded p-2">
                                            <p className="font-medium">Verified items:</p>
                                            <ul className="mt-1 list-disc pl-5">
                                                {req.verified_items.map((item) => (
                                                    <li key={item.barcode}>
                                                        {item.product_name} - barcode{" "}
                                                        <code className="text-xs">{item.barcode}</code>
                                                        <button
                                                            onClick={() => removeVerifiedItem(req.id, item.barcode)}
                                                            type="button"
                                                            className="ml-2 text-sm text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {req.status === "pending" && req.request_type === "multiple" && (
                                        <div className="mt-4 space-y-3">
                                            <div className="flex flex-wrap gap-2 items-end">
                                                <div className="flex flex-col">
                                                    <label className="text-xs font-medium text-gray-600 mb-1">
                                                        Scan or type barcode
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="border rounded px-3 py-2 min-w-[200px]"
                                                        placeholder="Barcode"
                                                        value={barcodes[req.id] ?? ""}
                                                        onChange={(e) => setBarcodeFor(req.id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault()
                                                                verifyItem(req.id)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => verifyItem(req.id)}
                                                    className="bg-slate-700 hover:bg-slate-900 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Add verified item
                                                </button>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    disabled={!(req.item_barcodes?.length > 0)}
                                                    onClick={() => updateRequest(req.id, "approved")}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateRequest(req.id, "rejected")}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Optional message to requester
                                                </label>
                                                <textarea
                                                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                                                    rows="2"
                                                    placeholder="Add a message explaining the decision (optional)..."
                                                    value={messages[req.id] ?? ""}
                                                    onChange={(e) => setMessageFor(req.id, e.target.value)}
                                                />
                                            </div>
                                            {!(req.item_barcodes?.length > 0) && (
                                                <p className="text-xs text-gray-500">
                                                    Approve stays disabled until at least one item is verified.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {req.status === "pending" && req.request_type === "single" && (
                                        <div className="mt-4 space-y-3 border-t pt-4">
                                            <p className="text-sm font-medium text-gray-800">Break item to send (single request)</p>
                                            {breakItems.length === 0 ? (
                                                <p className="text-sm text-amber-700">No break items in stock.</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-3 items-end">
                                                    <div className="flex flex-col min-w-[220px]">
                                                        <label className="text-xs font-medium text-gray-600 mb-1">
                                                            Filter break items
                                                        </label>
                                                        <input
                                                            type="search"
                                                            className="border rounded px-3 py-2 text-sm mb-2"
                                                            placeholder="Name or barcode…"
                                                            value={breakItemFilter[req.id] ?? ""}
                                                            onChange={(e) => setBreakItemFilterFor(req.id, e.target.value)}
                                                        />
                                                        <label className="text-xs font-medium text-gray-600 mb-1">
                                                            Break item
                                                        </label>
                                                        <select
                                                            className="border rounded px-3 py-2 text-sm"
                                                            value={currentAllocItemId(req)}
                                                            onChange={(e) => setAllocItemFor(req.id, e.target.value)}
                                                        >
                                                            <option value="">Select…</option>
                                                            {filteredBreakItems(req).map((item) => (
                                                                <option key={item.id} value={String(item.id)}>
                                                                    {item.product_name} ({formatBarcodes(item.barcode)}) —{" "}
                                                                    {item.quantity_pack} pcs
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col w-28">
                                                        <label className="text-xs font-medium text-gray-600 mb-1">
                                                            Pieces
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="border rounded px-3 py-2 text-sm"
                                                            placeholder="Qty"
                                                            value={currentAllocQty(req)}
                                                            onChange={(e) => setAllocQtyFor(req.id, e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => saveBreakAllocationFor(req)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
                                                    >
                                                        Add allocation line
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    disabled={!(req.admin_break_allocations?.length > 0)}
                                                    onClick={() => updateRequest(req.id, "approved")}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateRequest(req.id, "rejected")}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Optional message to requester
                                                </label>
                                                <textarea
                                                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                                                    rows="2"
                                                    placeholder="Add a message explaining the decision (optional)..."
                                                    value={messages[req.id] ?? ""}
                                                    onChange={(e) => setMessageFor(req.id, e.target.value)}
                                                />
                                            </div>
                                            {!(req.admin_break_allocations?.length > 0) && (
                                                <p className="text-xs text-gray-500">
                                                    Save a break allocation before approving.
                                                </p>
                                            )}
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
