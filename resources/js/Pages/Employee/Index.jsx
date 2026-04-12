import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { router, useForm } from "@inertiajs/react"
import { useState } from "react"

function RequestLinesEditor({ messages, quantities, setData, quantityLabel }) {
    function removeLine(index) {
        if (messages.length <= 1) return
        setData(
            "message",
            messages.filter((_, i) => i !== index),
        )
        setData(
            "request_quantity",
            quantities.filter((_, i) => i !== index),
        )
    }

    return (
        <div className="space-y-3">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-500 ring-1 ring-slate-200">
                        {index + 1}
                    </div>
                    <div className="min-w-[200px] flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Item / description</label>
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => {
                                const next = [...messages]
                                next[index] = e.target.value
                                setData("message", next)
                            }}
                            placeholder="What do you need?"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        />
                    </div>
                    <div className="w-full sm:w-32">
                        <label className="mb-1 block text-xs font-medium text-slate-600">{quantityLabel}</label>
                        <input
                            type="number"
                            min={0}
                            value={quantities[index] ?? ""}
                            onChange={(e) => {
                                const next = [...quantities]
                                next[index] = e.target.value
                                setData("request_quantity", next)
                            }}
                            placeholder="Qty"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                        />
                    </div>
                    {messages.length > 1 ? (
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

export default function Index({ users }) {
    const { data: requestData, setData: setRequestData, reset: resetForm } = useForm({
        message: [""],
        request_quantity: [""],
    })

    function submitMultipleRequest(e) {
        e.preventDefault()
        router.post(
            route("submit_request"),
            {
                request_type: "multiple",
                message: requestData.message,
                request_quantity: requestData.request_quantity,
            },
            {
                onSuccess: () => {
                    resetForm()
                    setShowSuccess(true)
                },
            },
        )
    }

    function submitSingleRequest(e) {
        e.preventDefault()
        router.post(
            route("submit_request"),
            {
                request_type: "single",
                message: requestData.message,
                request_quantity: requestData.request_quantity,
            },
            {
                onSuccess: () => {
                    resetForm()
                    setShowSuccess(true)
                },
            },
        )
    }

    const [showSuccess, setShowSuccess] = useState(false)
    const [showMultipleRequest, setShowMultipleRequest] = useState(false)
    const [showSingleRequest, setShowSingleRequest] = useState(true)

    function addLine() {
        setRequestData("message", [...requestData.message, ""])
        setRequestData("request_quantity", [...requestData.request_quantity, ""])
    }

    return (
        <Layout>
            <EmployeeLayout>
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-600">
                            Welcome{users?.department ? ` — ${users.department}` : ""}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">New request</h1>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    setShowSingleRequest(true)
                                    setShowMultipleRequest(false)
                                }}
                                type="button"
                                className={`rounded-xl px-6 py-3 text-sm font-semibold shadow transition ${
                                    showSingleRequest
                                        ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Single requests
                            </button>
                            <button
                                onClick={() => {
                                    setShowMultipleRequest(true)
                                    setShowSingleRequest(false)
                                }}
                                type="button"
                                className={`rounded-xl px-6 py-3 text-sm font-semibold shadow transition ${
                                    showMultipleRequest
                                        ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                Multiple requests
                            </button>
                        </div>
                    </div>

                    <div
                        key={showSingleRequest ? "single" : "multiple"}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-modePanelIn"
                    >
                        {showMultipleRequest ? (
                            <>
                                <h2 className="text-lg font-semibold text-slate-900">Multiple requests</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Add one row per item. Remove rows you don&apos;t need.
                                </p>
                                <form onSubmit={submitMultipleRequest} className="mt-6 space-y-6">
                                    <RequestLinesEditor
                                        messages={requestData.message}
                                        quantities={requestData.request_quantity}
                                        setData={setRequestData}
                                        quantityLabel="Quantity (per pack)"
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={addLine}
                                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            + Add line
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
                                        >
                                            Submit request
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold text-slate-900">Single requests</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    One or more lines; each quantity is per piece.
                                </p>
                                <form onSubmit={submitSingleRequest} className="mt-6 space-y-6">
                                    <RequestLinesEditor
                                        messages={requestData.message}
                                        quantities={requestData.request_quantity}
                                        setData={setRequestData}
                                        quantityLabel="Quantity (per piece)"
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={addLine}
                                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            + Add line
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
                                        >
                                            Submit request
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>

                    {showSuccess && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                            Request submitted successfully!
                        </div>
                    )}
                </div>
            </EmployeeLayout>
        </Layout>
    )
}
