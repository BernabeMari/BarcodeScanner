import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { useForm } from "@inertiajs/react"

export default function(){
    
    const {post, data: createData, setData: setCreateData, reset: resetForm} = useForm({
        username: '',
        password: '',
        role: '',
})

    function createUser(e){
        post(route('create_user'))
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
                        <button type="submit" className="m-4 rounded-full bg-red-400 hover:bg-red-800 cursor-pointer">Create</button>
                    </form>
                </SidebarLayout>
            </Layout>
        </div>
    )
}