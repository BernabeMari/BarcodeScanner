import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { formatBarcodes } from "@/utils/formatBarcodes"
import { router, usePage } from "@inertiajs/react"

export default function BreakItemsPage({ items }) {
    const { errors } = usePage().props

    const canUnbreak = (item) =>
        item.break_initial_pieces != null &&
        Number(item.quantity_pack) === Number(item.break_initial_pieces)

    function unbreakItem(item) {
        if (!canUnbreak(item)) {
            return
        }
        router.post(route("unbreak_break_item", item.id), {}, { preserveScroll: true })
    }

    return (
            <Layout>
                <SidebarLayout>
                    <p className="mb-4 text-2xl font-bold tracking-tight text-white drop-shadow-md">Break items</p>
                    {errors?.unbreak && (
                        <p className="mb-4 max-w-2xl rounded-xl border border-red-200/60 bg-white/95 px-4 py-3 text-sm text-red-700 shadow-sm">
                            {Array.isArray(errors.unbreak) ? errors.unbreak[0] : errors.unbreak}
                        </p>
                    )}
                    {items.length === 0 ? (
                        <p className="text-white/75">No break items yet.</p>
                    ) : (
                        items.filter((item) => item.quantity_pack > 0 && item.break === "break").map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2"
                            >
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Product Name:</span> {item.product_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Barcode:</span>{" "}
                                    <code className="text-xs bg-gray-100 px-1 rounded">
                                        {formatBarcodes(item.barcode)}
                                    </code>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Pieces per pack (reference):</span>{" "}
                                    {item.quantity_piece}
                                </p>
                                <p className="text-sm text-gray-800 font-semibold mt-1">
                                    <span className="font-medium">Pieces remaining:</span> {item.quantity_pack}
                                </p>
                                <button
                                    type="button"
                                    disabled={!canUnbreak(item)}
                                    onClick={() => unbreakItem(item)}
                                    className="mt-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Unbreak item
                                </button>
                                {!canUnbreak(item) && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Unbreak is only available when pieces remaining matches the count from when
                                        this line was created.
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </SidebarLayout>
            </Layout>
    )
}
