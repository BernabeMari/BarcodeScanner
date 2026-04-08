import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { useForm } from "@inertiajs/react"


export default function(){
    const {post, data, setData, reset} = useForm({
        profile_picture: '',
        profile_id: null
    })

    function updateProfile(e){
        e.preventDefault()
        post(route('update_profile'), {
            onSuccess: () => reset()
        })
    }

    function handleUpdate(e){
        setData('profile_picture', e.target.files[0]),
        setData('profile_id', props.auth.user.id)
    }
    return(
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')",
            }}
        >
            <Layout>
                <EmployeeLayout>
                    <form onSubmit={updateProfile}>
                        <input type="file" onChange={(e) => handleUpdate(e)} />
                        <button type="submit">Change Profile</button>
                    </form>
                </EmployeeLayout>    
            </Layout>            

        </div>
    )
}