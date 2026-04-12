import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"

export default function AdminHome() {
    return (
        <Layout>
            <SidebarLayout>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Admin dashboard</h1>
                    <p className="mt-2 text-slate-600">
                        Use the navigation on the left to manage inventory, requests, and users.
                    </p>
                </div>
            </SidebarLayout>
        </Layout>
    )
}
