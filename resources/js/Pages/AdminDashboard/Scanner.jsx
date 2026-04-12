import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { useForm } from "@inertiajs/react"
import { useEffect, useState } from "react"

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"

const labelClass = "mb-1 block text-xs font-medium text-slate-600"

function BarcodeLinesEditor({ barcodes, setData }) {
    function removeLine(index) {
        if (barcodes.length <= 1) {
            return
        }
        setData(
            "barcode",
            barcodes.filter((_, i) => i !== index),
        )
    }

    return (
        <div className="space-y-3">
            {barcodes.map((row, index) => (
                <div
                    key={index}
                    className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-500 ring-1 ring-slate-200">
                        {index + 1}
                    </div>
                    <div className="min-w-[200px] flex-1">
                        <label className={labelClass}>Barcode</label>
                        <input
                            type="text"
                            value={row}
                            onChange={(e) => {
                                const next = [...barcodes]
                                next[index] = e.target.value
                                setData("barcode", next)
                            }}
                            placeholder="Scan or type barcode"
                            className={inputClass}
                            autoFocus={index === 0}
                        />
                    </div>
                    {barcodes.length > 1 ? (
                        <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Remove
                        </button>
                    ) : (
                        <span className="shrink-0 text-xs text-slate-400 sm:py-2">At least one line</span>
                    )}
                </div>
            ))}
        </div>
    )
}

function ItemDetailFields({ itemData, setData, packagingLabel, showPiecesPerPack = true }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">
                Quantity / pack: <strong className="text-slate-900">{itemData.quantity_pack}</strong> (from barcodes above)
            </p>
            <div>
                <label className={labelClass}>Item name</label>
                <input
                    type="text"
                    value={itemData.product_name}
                    onChange={(e) => setData("product_name", e.target.value)}
                    placeholder="Product name"
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>{packagingLabel}</label>
                <select
                    value={itemData.item_type}
                    onChange={(e) => setData("item_type", e.target.value)}
                    className={inputClass}
                >
                    <option value="" disabled>
                        Select type
                    </option>
                    <option value="Bottle">Bottle</option>
                    <option value="Box">Box</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Ream">Ream</option>
                    <option value="Unit">Unit</option>
                    <option value="Other">Other…</option>
                </select>
            </div>
            {itemData.item_type === "Other" && (
                <div>
                    <label className={labelClass}>Specify type</label>
                    <input
                        type="text"
                        placeholder="Specify packaging"
                        className={inputClass}
                        value={itemData.item_type_custom}
                        onChange={(e) => setData("item_type_custom", e.target.value)}
                    />
                </div>
            )}
            {showPiecesPerPack && (
                <div>
                    <label className={labelClass}>Pieces per pack</label>
                    <input
                        type="number"
                        value={itemData.quantity_piece}
                        onChange={(e) => setData("quantity_piece", e.target.value)}
                        placeholder="Pieces per pack"
                        className={inputClass}
                        min={0}
                    />
                </div>
            )}
            <div>
                <label className={labelClass}>Status</label>
                <select
                    value={itemData.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className={inputClass}
                >
                    <option value="active">Active</option>
                </select>
            </div>
        </div>
    )
}

export default function Scanner() {
    const [showMultipleModal, showMultipleModalset] = useState(false)
    const [showSingleModal, showSingleModalset] = useState(true)
    const { post, data: itemData, setData: setItemData, reset: resetItemForm } = useForm({
        barcode: [""],
        product_name: "",
        quantity_pack: 0,
        quantity_piece: 0,
        status: "active",
        break: "not_break",
        item_type: "",
        item_type_custom: "",
    })

    useEffect(() => {
        const n = itemData.barcode.filter((x) => String(x).trim() !== "").length
        setItemData("quantity_pack", n)
    }, [itemData.barcode, setItemData])

    function submit_item(e) {
        e.preventDefault()
        post(route("create_item"), {
            onSuccess: () => {
                resetItemForm()
                showMultipleModalset(true)
                showSingleModalset(false)
            },
        })
    }

    function submit_single_item(e) {
        e.preventDefault()
        post(route("create_single_item"), {
            onSuccess: () => {
                resetItemForm()
                showMultipleModalset(true)
                showSingleModalset(false)
            },
        })
    }

    function addBarcodeLine() {
        setItemData("barcode", [...itemData.barcode, ""])
    }

    return (
        <Layout>
            <SidebarLayout>
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-600">Register products into inventory</p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create inventory item</h1>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    showSingleModalset(true)
                                    showMultipleModalset(false)
                                }}
                                className={`rounded-xl px-6 py-3 text-sm font-semibold shadow transition ${
                                    showSingleModal
                                        ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Single
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    showMultipleModalset(true)
                                    showSingleModalset(false)
                                }}
                                className={`rounded-xl px-6 py-3 text-sm font-semibold shadow transition ${
                                    showMultipleModal
                                        ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Multiple
                            </button>
                        </div>
                    </div>

                    <div
                        key={showSingleModal ? "single" : "multiple"}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-modePanelIn"
                    >
                        {showSingleModal ? (
                            <>
                                <h2 className="text-lg font-semibold text-slate-900">Single (break line)</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Each barcode is saved as its own inventory row (easier to issue, deduct, and show as
                                    inactive per barcode). Each row is one unit (quantity 1). All lines share the same
                                    product name and type. Remove lines you don&apos;t need.
                                </p>
                                <form onSubmit={submit_single_item} className="mt-6 space-y-6">
                                    <div>
                                        <p className="mb-3 text-sm font-medium text-slate-700">Barcodes</p>
                                        <BarcodeLinesEditor barcodes={itemData.barcode} setData={setItemData} />
                                    </div>
                                    <ItemDetailFields
                                        itemData={itemData}
                                        setData={setItemData}
                                        packagingLabel="Packaging type"
                                        showPiecesPerPack={false}
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={addBarcodeLine}
                                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            + Add line
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
                                        >
                                            Create item
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold text-slate-900">Multiple (packs)</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    One row per pack barcode. Remove lines you don&apos;t need.
                                </p>
                                <form onSubmit={submit_item} className="mt-6 space-y-6">
                                    <div>
                                        <p className="mb-3 text-sm font-medium text-slate-700">Barcodes</p>
                                        <BarcodeLinesEditor barcodes={itemData.barcode} setData={setItemData} />
                                    </div>
                                    <ItemDetailFields
                                        itemData={itemData}
                                        setData={setItemData}
                                        packagingLabel="Packaging type"
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={addBarcodeLine}
                                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            + Add line
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
                                        >
                                            Create item
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </SidebarLayout>
        </Layout>
    )
}
