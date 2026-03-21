import EmployeeLayout from "@/Layouts/EmployeeLayout"
import { router, usePage } from "@inertiajs/react"

function statusClass(status) {
    if (status === "approved") return "text-green-700"
    if (status === "rejected") return "text-red-700"
    if (status === "cancelled") return "text-slate-500"
    return "text-yellow-600"
}

export default function MyRequests({ requests }) {
    const { errors, flash } = usePage().props

    return (
        <div>
            <EmployeeLayout>
                <h1 className="text-2xl font-semibold mb-2">My requests</h1>
                <p className="text-gray-600 mb-6">
                    Track your item requests and their status.
                </p>
                {flash?.success && (
                    <p className="mb-4 text-green-700 text-sm">{flash.success}</p>
                )}
                {errors?.status && (
                    <p className="mb-4 text-red-600 text-sm">{errors.status}</p>
                )}

                {requests.length === 0 ? (
                    <p className="text-gray-500">You have not submitted any requests yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {requests.map((req) => (
                            <li
                                key={req.id}
                                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                            >
                                <p className="text-gray-800">
                                    <span className="font-medium">Request:</span> {req.message}
                                </p>
                                <p className="mt-2 text-sm">
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className={statusClass(req.status)}>{req.status}</span>
                                </p>
                                {(req.verified_items?.length ?? 0) > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">Verified items:</span>
                                        </p>
                                        <ul className="list-disc pl-5 mt-1">
                                            {req.verified_items.map((item) => (
                                                <li key={item.barcode}>
                                                    {item.product_name} (barcode {item.barcode})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className="mt-2 text-xs text-gray-400">
                                    Submitted {new Date(req.created_at).toLocaleString()}
                                </p>
                                {req.approved_at && (
                                    <p className="mt-1 text-xs text-green-700">
                                        Approved at {new Date(req.approved_at).toLocaleString()}
                                    </p>
                                )}
                                {req.rejected_at && (
                                    <p className="mt-1 text-xs text-red-700">
                                        Rejected at {new Date(req.rejected_at).toLocaleString()}
                                    </p>
                                )}
                                {req.cancelled_at && (
                                    <p className="mt-1 text-xs text-slate-600">
                                        Cancelled at {new Date(req.cancelled_at).toLocaleString()}
                                    </p>
                                )}

                                {req.status === "pending" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.post(route("cancel_request", req.id))
                                        }
                                        className="mt-4 bg-slate-700 hover:bg-slate-900 text-white px-4 py-2 rounded-lg"
                                    >
                                        Cancel request
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </EmployeeLayout>
        </div>
    )
}
