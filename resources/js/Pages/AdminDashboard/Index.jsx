import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"
export default function(){
    return(
        <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}>
            <Layout>
                <SidebarLayout>
            <div className="min-h-screen">asda2s</div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}