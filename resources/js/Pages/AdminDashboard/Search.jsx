import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { router } from "@inertiajs/react";
import { useState } from "react";

function barcodeSlotActive(item, index) {
    if (Array.isArray(item.statuses) && item.statuses[index] !== undefined) {
        return item.statuses[index] !== "inactive"
    }
    return item.status === "active"
}

export default function Search({ items, error }) {
    const [pendingBreak, setPendingBreak] = useState(null)

    function handleScan(scannedBarcode) {
        router.get(route('search_page', { barcode: scannedBarcode }));
    }

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

    const rows = (items ?? []).flatMap((item) => {
        const codes = Array.isArray(item.barcode)
            ? item.barcode.filter((c) => c != null && String(c).trim() !== "")
            : []
        return codes
            .map((code, idx) => ({ item, code, idx }))
            .filter(({ item, idx }) => barcodeSlotActive(item, idx))
    })

    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')" }}
        >
            <Layout>
                <SidebarLayout>
                    <div className="p-4 text-white">
                        <input
                            type="text"
                            placeholder="Scan barcode"
                            autoFocus
                            className="w-full p-4 text-2xl border rounded opacity-70 text-black"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleScan(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                        />

                        {error ? (
                            <div className="mt-4 text-red-300">{error}</div>
                        ) : rows.length ? (
                            <div className="mt-4 space-y-4">
                                {rows.map(({ item, code }) => (
                                    <div
                                        key={`${item.id}-${code}`}
                                        className="rounded-lg border border-white/20 bg-black/30 p-4"
                                    >
                                        <div className="font-semibold">Item found</div>
                                        <div>Name: {item.product_name}</div>
                                        <div>
                                            Barcode:{" "}
                                            <code className="text-sm bg-white/10 px-1 rounded">{code}</code>
                                        </div>
                                        <div>Quantity / Pack: {item.quantity_pack}</div>
                                        <div>Quantity / Piece: {item.quantity_piece}</div>
                                        <div>Department: {item.department}</div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                                                This barcode: active
                                            </span>
                                            {item.break === "not_break" && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPendingBreak({ id: item.id, barcode: code })}
                                                    className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Break this barcode
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 text-white text-2xl">
                                Scan a barcode to see the result.
                            </div>
                        )}
                    </div>

                    {pendingBreak && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                            <div className="bg-slate-700 text-white rounded-xl p-6 max-w-md shadow-xl">
                                <p className="mb-4">
                                    Move barcode{" "}
                                    <code className="bg-slate-900 px-1 rounded">{pendingBreak.barcode}</code> to break
                                    items?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPendingBreak(null)}
                                        className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmBreak}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </SidebarLayout>
            </Layout>
        </div>
    )
}
