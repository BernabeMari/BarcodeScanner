import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"

export default function Requests({ requests }) {
    const { errors, flash } = usePage().props
    const [barcodes, setBarcodes] = useState({})
    const [messages, setMessages] = useState({})

    function setBarcodeFor(id, value) {
        setBarcodes((prev) => ({ ...prev, [id]: value }))
    }

    function setMessageFor(id, value) {
        setMessages((prev) => ({ ...prev, [id]: value }))
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
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')" }}
        >
            <Layout>
                <SidebarLayout>
                    <h1 className="text-2xl font-semibold text-white mb-4">Employee requests</h1>
                    <p className="text-gray-200 mb-2">
                        Scan or enter one or more barcodes while the request is pending. Items
                        stay active during verification and are set to inactive only when the
                        request is approved.
                    </p>
                    {flash?.success && (
                        <p className="mb-4 text-green-700 text-sm">{flash.success}</p>
                    )}
                    {errors?.barcode && (
                        <p className="mb-4 text-red-600 text-sm">{errors.barcode}</p>
                    )}
                    {errors?.status && (
                        <p className="mb-4 text-red-600 text-sm">{errors.status}</p>
                    )}
                    {requests.length === 0 ? (
                        <p className="text-gray-500">No requests yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {requests.map((req) => (
                                <li
                                    key={req.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                                >
                                    <p className="font-medium text-gray-900">
                                        {req.user?.username ?? "Unknown user"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Department:</span>{" "}
                                        {req.user?.department?.trim()
                                            ? req.user.department
                                            : "—"}
                                    </p>
                                     <p className="text-gray-800">
                                    <span className="font-medium">Request Type: ({req.request_type})</span>
                                    </p>
                                    <p className="text-gray-800">
                                    <span className="font-medium">Request:</span>
                                    <ul className="ml-4 list-disc">
                                        {req.message.map((msg, index) => (
                                        <li key={index}>
                                            {msg} – {req.request_quantity[index]}
                                        </li>
                                        ))}
                                    </ul>
                                    </p>
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
                                    {(req.verified_items?.length ?? 0) > 0 && (
                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded p-2">
                                            <p>
                                                <span className="font-medium">Verified items:</span>
                                            </p>
                                            <ul className="mt-1 list-disc pl-5">
                                                {req.verified_items.map((item) => (
                                                    <li key={item.barcode}>
                                                        {item.product_name} - barcode{" "}
                                                        <code className="text-xs">{item.barcode}</code>
                                                        <button onClick={() => removeVerifiedItem(req.id, item.barcode)} type="button" className="ml-2 text-sm text-red-500 hover:text-red-700">
                                                            Remove
                                                        </button>
                                                    </li>       
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {req.status === "pending" && (
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
                                                        onChange={(e) =>
                                                            setBarcodeFor(req.id, e.target.value)
                                                        }
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
                                </li>
                            ))}
                        </ul>
                    )}
                </SidebarLayout>
            </Layout>
        </div>
    )
}
