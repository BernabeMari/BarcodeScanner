import EmployeeLayout from "@/Layouts/EmployeeLayout"
import Layout from "@/Layouts/Layout"
import { useForm, usePage } from "@inertiajs/react"

export default function Profile() {
    const { auth } = usePage().props
    const { post, data, setData, reset } = useForm({
        profile_picture: "",
        profile_id: null,
    })

    function updateProfile(e) {
        e.preventDefault()
        post(route("update_profile"), {
            onSuccess: () => reset(),
        })
    }

    function handleUpdate(e) {
        const file = e.target.files?.[0]
        if (!file) return
        setData("profile_picture", file)
        setData("profile_id", auth.user.id)
    }

    return (
        <Layout>
            <EmployeeLayout>
                <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
                    <p className="mt-1 text-sm text-slate-600">Update your profile picture.</p>
                    <form onSubmit={updateProfile} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Profile photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpdate}
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
                        >
                            Save changes
                        </button>
                    </form>
                </div>
            </EmployeeLayout>
        </Layout>
    )
}
