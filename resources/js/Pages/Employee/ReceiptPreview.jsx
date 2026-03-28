import EmployeeLayout from "@/Layouts/EmployeeLayout"
import { router } from "@inertiajs/react"

export default function ReceiptPreview({ request, items, user }) {
    const handleDownload = () => {
        window.open(route("generate_receipt", request.id), '_blank')
    }

    const handleCancel = () => {
        router.visit(route("employee_my_requests"))
    }

    return (
        <div>
            <EmployeeLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h1 className="text-2xl font-semibold text-gray-900">Receipt Preview</h1>
                            <p className="text-gray-600 mt-1">Review your receipt before downloading</p>
                        </div>

                        <div className="p-6">
                            {/* Receipt Content */}
                            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                                {/* Header */}
                                <div className="text-center border-b-2 border-gray-400 pb-4 mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">Item Issuance Receipt</h2>
                                    <p className="text-lg text-gray-600 mt-2">Request ID: #{request.id}</p>
                                    <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleString()}</p>
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
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Request Details</h3>
                                    <p className="text-sm"><span className="font-medium">Message:</span> {request.message}</p>
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
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={handleDownload}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    Download Receipt
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </EmployeeLayout>
        </div>
    )
}