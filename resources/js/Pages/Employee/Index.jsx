import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { router, useForm } from "@inertiajs/react"
import { useState } from "react"

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

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')",
            }}
        >
            <Layout>
                <EmployeeLayout>
                    <p>Welcome {users.department}</p>
                    <h1>Employee Dashboard</h1>

                    <div className="flex flex-row justify-center">
                        <button
                            onClick={() => {
                                setShowSingleRequest(true)
                                setShowMultipleRequest(false)
                            }}
                            type="button"
                            className="bg-blue-400 rounded-full m-10 p-3"
                        >
                            Single Requests
                        </button>
                        <button
                            onClick={() => {
                                setShowMultipleRequest(true)
                                setShowSingleRequest(false)
                            }}
                            type="button"
                            className="bg-yellow-400 rounded-full m-10 p-3"
                        >
                            Multiple Requests
                        </button>
                    </div>

                    {showMultipleRequest && (
                        <div>
                            <p className="text-center bg-white">This is For Multiple Requests</p>
                            <form onSubmit={submitMultipleRequest} className="flex flex-col">
                                <div className="flex flex-row justify-center">
                                    <div className="flex-col flex bg-red-300 m-10 rounded-3xl">
                                        {requestData.message.map((request, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="rounded-full m-4"
                                                placeholder="Enter Your Request"
                                                value={request}
                                                onChange={(e) => {
                                                    const newRequest = [...requestData.message]
                                                    newRequest[index] = e.target.value
                                                    setRequestData("message", newRequest)
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex-col flex bg-red-300 m-10 rounded-3xl">
                                        {requestData.request_quantity.map((request_quantity, index) => (
                                            <input
                                                key={index}
                                                type="number"
                                                value={request_quantity}
                                                placeholder="Enter Qty (per pack)"
                                                className="rounded-full m-4"
                                                onChange={(e) => {
                                                    const newRequestQty = [...requestData.request_quantity]
                                                    newRequestQty[index] = e.target.value
                                                    setRequestData("request_quantity", newRequestQty)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRequestData("message", [...requestData.message, ""])
                                        setRequestData("request_quantity", [...requestData.request_quantity, ""])
                                    }}
                                    className="bg-green-300 m-4 rounded-3xl hover:bg-green-800"
                                >
                                    +
                                </button>
                                <button type="submit" className="m-4 rounded-full bg-blue-400 hover:bg-blue-800 cursor-pointer">
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    )}

                    {showSingleRequest && (
                        <div>
                            <p className="text-center bg-white">This is For Single Requests</p>
                            <form onSubmit={submitSingleRequest} className="flex flex-col">
                                <div className="flex flex-row justify-center">
                                    <div className="flex-col flex bg-red-300 m-10 rounded-3xl">
                                        {requestData.message.map((request, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="rounded-full m-4"
                                                placeholder="Enter Your Request"
                                                value={request}
                                                onChange={(e) => {
                                                    const newRequest = [...requestData.message]
                                                    newRequest[index] = e.target.value
                                                    setRequestData("message", newRequest)
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex-col flex bg-red-300 m-10 rounded-3xl">
                                        {requestData.request_quantity.map((request_quantity, index) => (
                                            <input
                                                key={index}
                                                type="number"
                                                value={request_quantity}
                                                placeholder="Enter Qty (per piece)"
                                                className="rounded-full m-4"
                                                onChange={(e) => {
                                                    const newRequestQty = [...requestData.request_quantity]
                                                    newRequestQty[index] = e.target.value
                                                    setRequestData("request_quantity", newRequestQty)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRequestData("message", [...requestData.message, ""])
                                        setRequestData("request_quantity", [...requestData.request_quantity, ""])
                                    }}
                                    className="bg-green-300 m-4 rounded-3xl hover:bg-green-800"
                                >
                                    +
                                </button>
                                <button type="submit" className="m-4 rounded-full bg-blue-400 hover:bg-blue-800 cursor-pointer">
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    )}

                    {showSuccess && (
                        <div className="m-4 p-4 bg-green-200 text-green-800 rounded-lg">
                            Request submitted successfully!
                        </div>
                    )}
                </EmployeeLayout>
            </Layout>
        </div>
    )
}
