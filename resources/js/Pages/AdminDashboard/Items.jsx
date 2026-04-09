import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"
import { useMemo, useState } from "react"
import { router } from '@inertiajs/react'

function barcodeSlotActive(item, index) {
    if (Array.isArray(item.statuses) && item.statuses[index] !== undefined) {
        return item.statuses[index] !== "inactive"
    }
    return item.status === "active"
}

export default function ItemsPage({ items}) {
    const [showAllItem, showAllItemState] = useState(true)
    const [showLowItem, showLowItemState] = useState(false)
    const [showHighItem, showHighItemState] = useState(false)
    const [showSingleItem, showSingleItemState] = useState(false)
    const [showMultipleItem, showMultipleItemState] = useState(false)
    const [pendingBreak, setPendingBreak] = useState(null)

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
            return catalogItems.filter((item) => item.break === 'break')
        }
        if (showMultipleItem) {
            return catalogItems.filter((item) => item.break === 'not_break')
        }
        return catalogItems
    }, [catalogItems, showAllItem, showLowItem, showHighItem, showSingleItem, showMultipleItem])

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

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')",
            }}
        >
            <Layout>
                <SidebarLayout>
                    <div className="text-white text-2xl font-bold mb-4">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    showAllItemState(true)
                                    showHighItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(false)
                                }}
                                className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                All Item
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    showLowItemState(true)
                                    showAllItemState(false)
                                    showHighItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(false)
                                }}
                                className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Low Stock
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    showHighItemState(true)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(false)
                                }}
                                className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                High Stock
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => {
                                    showHighItemState(false)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(false)
                                    showSingleItemState(true)
                                }}
                                className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Single Item
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    showHighItemState(false)
                                    showAllItemState(false)
                                    showLowItemState(false)
                                    showMultipleItemState(true)
                                    showSingleItemState(false)
                                }}
                                className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Multiple Item
                            </button>
                        </div>

                        <div>
                            {visibleItems.flatMap((item) => {
                                const codes = Array.isArray(item.barcode)
                                    ? item.barcode.filter((c) => c != null && String(c).trim() !== "")
                                    : []
                                return codes.flatMap((code, idx) => {
                                    if (!barcodeSlotActive(item, idx)) {
                                        return []
                                    }
                                    return (
                                    <div
                                        key={`${item.id}-${code}`}
                                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2"
                                    >
                                        <div className="border flex justify-between items-center border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Product Name:</span>{" "}
                                                    {item.product_name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Barcode:</span>{" "}
                                                    <code className="text-xs bg-gray-100 px-1 rounded">{code}</code>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Quantity / Pack:</span>{" "}
                                                    {item.quantity_pack}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Quantity / Piece:</span>{" "}
                                                    {item.quantity_piece}
                                                </p>
                                            </div>
                                            {item.break === "not_break" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPendingBreak({ id: item.id, barcode: code })
                                                }
                                                className="bg-red-400 p-4 rounded-3xl"
                                            >
                                                Break
                                            </button>
                                            )}
                                        </div>
                                    </div>
                                    )
                                })
                            })}
                        </div>
                    </div>

                    {pendingBreak && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                            <div className="bg-slate-600 text-white w-auto rounded-3xl p-6 max-w-md">
                                <p className="mb-4">
                                    Move barcode{" "}
                                    <code className="bg-slate-800 px-1 rounded">{pendingBreak.barcode}</code>{" "}
                                    to break items?{" "}
                                    {visibleItems.find((i) => i.id === pendingBreak.id)?.barcode?.length === 1
                                        ? "The whole product row will move to Break Items."
                                        : "This barcode will be split into its own break line."}
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setPendingBreak(null)}
                                        className="bg-green-500 hover:bg-green-600 rounded-3xl px-6 py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmBreak}
                                        className="bg-red-500 hover:bg-red-600 rounded-3xl px-6 py-3"
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
