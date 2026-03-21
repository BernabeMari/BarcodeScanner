import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { router } from "@inertiajs/react"

export default function DoneRequests({ requests, filter }) {
    function setFilter(next) {
        router.get(
            route("requests_done_page"),
            { status: next },
            { preserveScroll: true, preserveState: true },
        )
    }

    return (
        <div>
            <Layout>
                <SidebarLayout>
                    <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                        <h1 className="text-2xl font-semibold">Done requests</h1>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className={
                                    filter === "all"
                                        ? "bg-slate-800 text-white px-4 py-2 rounded-lg"
                                        : "bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300"
                                }
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("approved")}
                                className={
                                    filter === "approved"
                                        ? "bg-green-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-green-100 text-green-900 px-4 py-2 rounded-lg hover:bg-green-200"
                                }
                            >
                                Approved
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("rejected")}
                                className={
                                    filter === "rejected"
                                        ? "bg-red-700 text-white px-4 py-2 rounded-lg"
                                        : "bg-red-100 text-red-900 px-4 py-2 rounded-lg hover:bg-red-200"
                                }
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

                    {requests.length === 0 ? (
                        <p className="text-gray-500">No done requests yet.</p>
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
                                    <p className="mt-3 text-gray-800">
                                        <span className="font-medium">Request:</span>{" "}
                                        {req.message}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span
                                            className={
                                                req.status === "approved"
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }
                                        >
                                            {req.status}
                                        </span>
                                    </p>

                                    {req.approved_at && (
                                        <p className="mt-1 text-xs text-green-700">
                                            Approved at{" "}
                                            {new Date(req.approved_at).toLocaleString()}
                                        </p>
                                    )}
                                    {req.rejected_at && (
                                        <p className="mt-1 text-xs text-red-700">
                                            Rejected at{" "}
                                            {new Date(req.rejected_at).toLocaleString()}
                                        </p>
                                    )}

                                    {(req.verified_items?.length ?? 0) > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-gray-700">
                                                Verified items:
                                            </p>
                                            <ul className="list-disc pl-5 mt-1">
                                                {req.verified_items.map((item) => (
                                                    <li key={item.barcode}>
                                                        {item.product_name} (barcode{" "}
                                                        {item.barcode})
                                                    </li>
                                                ))}
                                            </ul>
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

