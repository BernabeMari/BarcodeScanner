import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"

export default function({items}){
    return(
        <div>
            <Layout>
                <SidebarLayout>
            <div className="min-h-screen">
                {items.map((item)=>(
                    <div>
                        {item.product_name}
                    </div>
                ))}
            </div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}