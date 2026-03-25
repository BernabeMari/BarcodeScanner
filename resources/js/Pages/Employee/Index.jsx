import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
export default function({users}){
    
    const {post, data: requestData, setData: setRequestData, reset: resetForm} = useForm({
        message: '',
    })

    function submitRequest(e){
        e.preventDefault()
        post(route('submit_request'), {
            onSuccess: ()=>{resetForm();setShowSuccess(true)}
        })
    }
    const [showSuccess, setShowSuccess] = useState(false)
    return(
        <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}>
                <Layout>
                <EmployeeLayout>
                    <p>Welcome {users.department}</p>
                    <h1>Employee Dashboard</h1>
                    <form onSubmit={submitRequest} className="flex flex-col">
                        <textarea value={requestData.message} onChange={(e) => setRequestData('message', e.target.value)} placeholder="Enter your request for items" rows="4"/>
                        <button type="submit" className="m-4 rounded-full bg-blue-400 hover:bg-blue-800 cursor-pointer">Submit Request</button>                       
                    </form>

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