import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { router } from "@inertiajs/react"

function formatRequestLines(message, quantities) {
    const lines = Array.isArray(message) ? message : message != null && String(message).trim() !== "" ? [String(message)] : []
    const qty = Array.isArray(quantities) ? quantities : []
    if (lines.length === 0) return [{ text: "—", key: "empty" }]
    return lines.map((msg, i) => ({
        key: i,
        text: msg,
        qty: qty[i],
    }))
}

export default function ReceiptPreview({ request, items, user }) {
    const handleDownload = () => {
        const url = route("generate_receipt", request.id)
        const a = document.createElement("a")
        a.href = url
        a.setAttribute("download", `receipt_${request.id}.pdf`)
        a.rel = "noopener"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const handleCancel = () => {
        router.visit(route("employee_my_requests"))
    }

    return (
        <Layout>
            <EmployeeLayout>
                <div className="mx-auto w-full max-w-4xl px-0 sm:px-1">
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Receipt Preview</h1>
                            <p className="mt-1 text-sm text-gray-600 sm:text-base">Review your receipt before downloading the PDF</p>
                        </div>

                        <div className="p-4 sm:p-6">
                            {/* Receipt Content */}
                            <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4 sm:p-6">
                                {/* Header */}
                                <div className="mb-6 border-b-2 border-gray-400 pb-4 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Item Issuance Receipt</h2>
                                    <p className="mt-2 text-base text-gray-600 sm:text-lg">Request ID: #{request.id}</p>
                                    <p className="text-xs text-gray-500 sm:text-sm">Generated on: {new Date().toLocaleString()}</p>
                                </div>

                                {/* Requester Information */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Requester Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm"><span className="font-medium">Name:</span> {user.username}</p>
                                            <p className="text-sm"><span className="font-medium">Department:</span> {user.department || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm"><span className="font-medium">Request Date:</span> {new Date(request.created_at).toLocaleString()}</p>
                                            <p className="text-sm"><span className="font-medium">Approved Date:</span> {new Date(request.approved_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Request Details</h3>
                                    <p className="text-sm font-medium text-gray-800">Request line(s):</p>
                                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                                        {formatRequestLines(request.message, request.request_quantity).map((row) => (
                                            <li key={row.key}>
                                                {row.text}
                                                {row.qty !== undefined && row.qty !== null && row.qty !== "" ? ` — Qty: ${row.qty}` : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Issued Items */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Issued Items</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-900">Barcode</th>
                                                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-900">Product Name</th>
                                                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-900">Qty</th>
                                                    <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-900">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.barcode} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-900">{item.barcode}</td>
                                                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-900">{item.product_name}</td>
                                                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-900">
                                                            {item.issued_quantity != null ? item.issued_quantity : "—"}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300 text-sm text-green-700 font-medium">
                                                            {item.issued_quantity != null ? "Break pieces issued" : "Inactive (Issued)"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Signature Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div className="text-center">
                                        <div className="border-t border-gray-400 mt-8 pt-2">
                                            <p className="text-sm text-gray-600">Requester Signature</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-t border-gray-400 mt-8 pt-2">
                                            <p className="text-sm text-gray-600">Admin/Issuer Signature</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center mt-8 text-sm text-gray-500">
                                    <p>This receipt serves as proof of item issuance. Please keep this document for your records.</p>
                                    <p className="mt-1">Generated by Inventory Management System</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg bg-gray-500 px-6 py-2.5 font-medium text-white hover:bg-gray-600 sm:py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 sm:py-2"
                                >
                                    Download PDF receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </EmployeeLayout>
        </Layout>
    )
}