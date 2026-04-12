import Modal from "@/Components/Modal"
import UserAvatar from "@/Components/UserAvatar"
import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { useForm } from "@inertiajs/react"
import { useState } from "react"

export default function CreateUser({ users }) {
    const [open, setOpen] = useState(false)
    const { post, data: createData, setData: setCreateData, reset: resetForm, processing } = useForm({
        username: "",
        password: "",
        role: "",
        department: "",
    })

    function createUser(e) {
        e.preventDefault()
        post(route("create_user"), {
            onSuccess: () => {
                resetForm()
                setOpen(false)
            },
        })
    }

    return (
        <Layout>
            <SidebarLayout>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">Users</h1>
                <p className="text-slate-600 mb-6 text-sm">
                    View all accounts. Tap the + button (bottom right) to create a new user.
                </p>

                {users.length === 0 ? (
                    <p className="text-slate-500 text-sm">No users yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-24">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                            >
                                <UserAvatar user={user} className="h-14 w-14 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-900 truncate">{user.username}</p>
                                    <p className="text-sm text-slate-600 capitalize mt-0.5">{user.role}</p>
                                    {user.department ? (
                                        <p className="text-xs text-slate-500 mt-2 rounded-md bg-slate-50 px-2 py-1 inline-block">
                                            {user.department}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-3xl font-light leading-none text-white shadow-lg ring-4 ring-slate-100 hover:opacity-95 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
                    aria-label="Create new user"
                >
                    +
                </button>

                <Modal show={open} onClose={() => setOpen(false)} maxWidth="md">
                    <div className="border-b border-white/20 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">Create user</h2>
                        <p className="text-sm text-white/90">New admin or employee account</p>
                    </div>
                    <form onSubmit={createUser} className="space-y-4 p-6">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Username</label>
                            <input
                                type="text"
                                value={createData.username}
                                onChange={(e) => setCreateData("username", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
                            <input
                                type="password"
                                value={createData.password}
                                onChange={(e) => setCreateData("password", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
                            <select
                                value={createData.role}
                                onChange={(e) => setCreateData("role", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                                required
                            >
                                <option value="" disabled>
                                    Select role
                                </option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        {createData.role === "employee" && (
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">Department</label>
                                <input
                                    type="text"
                                    value={createData.department}
                                    onChange={(e) => setCreateData("department", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                                    placeholder="Department"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-50"
                            >
                                {processing ? "Creating…" : "Create user"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </SidebarLayout>
        </Layout>
    )
}
