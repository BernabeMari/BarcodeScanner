import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { useForm } from "@inertiajs/react"

export default function({ users }){
    
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
        <div className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}
        >
            <Layout>
                <SidebarLayout>
                    <form onSubmit={createUser} className="flex flex-col p-4 bg-white bg-opacity-90 rounded-lg mb-5">
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

                    <div >
                        {users.map((user) => (
                            <div key={user.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                                <p className="text-sm text-gray-600"><span className="font-medium">Username:</span> {user.username}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> {user.role}</p>
                                {user.department && (
                                    <p className="text-sm text-gray-600"><span className="font-medium">Department:</span> {user.department}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}