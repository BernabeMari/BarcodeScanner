import { useForm } from "@inertiajs/react"
import { useState } from "react"

export default function Login() {
    const { data, setData, post } = useForm({
        username: "",
        password: "",
    })

    const [showMessage, setShowMessage] = useState(false)

    function login(e) {
        e.preventDefault()
        post(route("login"), {
            onError: () => setShowMessage(true),
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <header className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white py-6 px-4 shadow-md">
                <div className="mx-auto flex max-w-md items-center gap-3">
                    <img src="/images/tcu-logo.jpg" alt="" className="h-14 w-14 rounded-full ring-2 ring-white/30" />
                    <div>
                        <p className="text-lg font-bold italic sm:text-xl">Taguig City University</p>
                        <p className="text-xs text-white/90 sm:text-sm">Transforming Excellence into Purpose</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-5">
                        <p className="text-center text-lg font-semibold text-white sm:text-xl">Sign in</p>
                        <p className="mt-1 text-center text-sm text-white/90">Use your TCU credentials</p>
                    </div>

                    <form onSubmit={login} className="flex flex-col space-y-4 p-6">
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                            placeholder="Username"
                            autoComplete="username"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-rose-500/0 transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                        />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Password"
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-rose-500/0 transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                        />
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] py-2.5 font-semibold text-white shadow hover:opacity-95 transition"
                        >
                            Login
                        </button>
                    </form>

                    {showMessage && (
                        <p className="px-6 pb-6 text-center text-sm font-medium text-red-600">Invalid username or password.</p>
                    )}
                </div>
            </div>

            <footer className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] py-3 text-center text-xs font-semibold text-white sm:text-sm">
                © {new Date().getFullYear()} Taguig City University — All rights reserved
            </footer>
        </div>
    )
}
