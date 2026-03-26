import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"

export default function({items}){
    return(
        <div className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}
>
            <Layout>
                <SidebarLayout>
                    <p className="text-white text-2xl font-bold mb-4">Break Items</p>
        {items.map(item =>(
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Product Name:</span> {item.product_name}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Barcode:</span> {item.barcode}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
            </div>
        ))}
            </SidebarLayout>
        </Layout>
        </div>
    )
}