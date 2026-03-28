import Layout from "../../Layouts/Layout"
import SidebarLayout from "../../Layouts/sidebarLayout"

function barcodeSlotActive(item, index) {
    if (Array.isArray(item.statuses) && item.statuses[index] !== undefined) {
        return item.statuses[index] !== "inactive"
    }
    return item.status === "active"
}

export default function InactiveItemsPage({ items }) {
    const rows = (items ?? []).flatMap((item) => {
        const codes = Array.isArray(item.barcode)
            ? item.barcode.filter((c) => c != null && String(c).trim() !== "")
            : []

        return codes.flatMap((code, idx) => {
            if (barcodeSlotActive(item, idx)) {
                return []
            }
            return [
                {
                    key: `${item.id}-${idx}-${code}`,
                    productName: item.product_name,
                    barcode: code,
                    quantityPack: item.quantity_pack,
                    quantityPiece: item.quantity_piece,
                },
            ]
        })
    })

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')",
            }}
        >
            <Layout>
                <SidebarLayout>
                    <p className="text-white text-2xl font-bold mb-4">Inactive items (by barcode)</p>
                    <p className="text-gray-200 text-sm mb-4 max-w-2xl">
                        Each row is one inactive barcode slot. Products with several barcodes can be partly active
                        and partly inactive.
                    </p>
                    {rows.length === 0 ? (
                        <p className="text-gray-300">No inactive barcode slots.</p>
                    ) : (
                        rows.map((row) => (
                            <div
                                key={row.key}
                                className="p-4 bg-white bg-opacity-90 font-medium rounded-lg shadow-md m-4 border border-gray-200"
                            >
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">Product:</span> {row.productName}
                                </p>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">Barcode:</span>{" "}
                                    <code className="text-xs bg-gray-100 px-1 rounded">{row.barcode}</code>
                                </p>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">Quantity / Piece:</span> {row.quantityPiece}
                                </p>
                            </div>
                        ))
                    )}
                </SidebarLayout>
            </Layout>
        </div>
    )
}
