import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"

function formatWhen(value) {
    if (!value) return null
    return new Date(value).toLocaleString()
}

export default function AuditLogs({ logs }) {
    return (
        <div>
            <Layout>
                <SidebarLayout>
                    <h1 className="text-2xl font-semibold mb-4">Audit logs</h1>

                    {logs.length === 0 ? (
                        <p className="text-gray-500">No audit entries yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                                >
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">When:</span>{" "}
                                        {formatWhen(log.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Request by:</span>{" "}
                                        {log.actor?.username ?? "Unknown"}
                                    </p>
                                    <p className="mt-2 text-gray-900">
                                        <span className="font-medium">Action:</span>{" "}
                                        {log.action}
                                        {log.from_status || log.to_status ? (
                                            <span className="text-gray-500">
                                                {" "}
                                                ({log.from_status ?? "—"} →{" "}
                                                {log.to_status ?? "—"})
                                            </span>
                                        ) : null}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">Request:</span>{" "}
                                        #{log.request_id}{" "}
                                        <span className="text-gray-400">
                                            (by{" "}
                                            {log.request?.user?.username ?? "Unknown"})"
                                        </span>
                                    </p>

                                    {log.request?.message ? (
                                        <p className="mt-2 text-gray-800">
                                            <span className="font-medium">Item request:</span>{" "}
                                            {log.request.message}
                                        </p>
                                    ) : null}

                                    {log.metadata?.barcode ? (
                                        <p className="mt-2 text-sm text-gray-700">
                                            <span className="font-medium">Barcode:</span>{" "}
                                            {log.metadata.barcode}
                                            {log.metadata.product_name ? (
                                                <span className="text-gray-500">
                                                    {" "}
                                                    ({log.metadata.product_name})
                                                </span>
                                            ) : null}
                                        </p>
                                    ) : null}

                                    {Array.isArray(log.metadata?.verified_barcodes) &&
                                    log.metadata.verified_barcodes.length > 0 ? (
                                        <p className="mt-2 text-sm text-gray-700">
                                            <span className="font-medium">Verified barcodes:</span>{" "}
                                            {log.metadata.verified_barcodes.join(", ")}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </SidebarLayout>
            </Layout>
        </div>
    )
}

