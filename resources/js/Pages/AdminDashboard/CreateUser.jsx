import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { useForm } from "@inertiajs/react"

export default function(){
    
    const {post, data: createData, setData: setCreateData, reset: resetForm} = useForm({
        username: '',
        password: '',
        role: '',
        department: '',
})

    function createUser(e){
        e.preventDefault()
        post(route('create_user'), {
            onSuccess: ()=>resetForm()
        })
    }
    return(
        <div>
            <Layout>
                <SidebarLayout>
                    <form onSubmit={createUser} className="flex flex-col">
                        <input type="text" value={createData.username} onChange={(e) => setCreateData('username', e.target.value)} placeholder="Enter Username"/>
                        <input type="text" value={createData.password} onChange={(e) => setCreateData('password', e.target.value)} placeholder="Enter Password"/>
                        <select value={createData.role} onChange={(e) => setCreateData('role', e.target.value)}>
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        </select>
                        {createData.role === 'employee' && (
                            <input type="text" value={createData.department} onChange={(e) => setCreateData('department', e.target.value)} placeholder="Enter Department"/>
                        )}
                        <button type="submit" className="m-4 rounded-full bg-red-400 hover:bg-red-800 cursor-pointer">Create</button>
                    </form>
                </SidebarLayout>
            </Layout>
        </div>
    )
}