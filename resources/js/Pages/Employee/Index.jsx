import EmployeeLayout from "@/Layouts/EmployeeLayout"
import { useForm } from "@inertiajs/react"

export default function(){
    
    const {post, data: requestData, setData: setRequestData, reset: resetForm} = useForm({
        message: '',
    })

    function submitRequest(e){
        e.preventDefault()
        post(route('submit_request'), {
            onSuccess: ()=>resetForm()
        })
    }

    return(
        <div>
                <EmployeeLayout>
                    <h1>Employee Dashboard</h1>
                    <form onSubmit={submitRequest} className="flex flex-col">
                        <textarea value={requestData.message} onChange={(e) => setRequestData('message', e.target.value)} placeholder="Enter your request for items" rows="4"/>
                        <button type="submit" className="m-4 rounded-full bg-blue-400 hover:bg-blue-800 cursor-pointer">Submit Request</button>
                    </form>
                </EmployeeLayout>
        </div>
    )
}