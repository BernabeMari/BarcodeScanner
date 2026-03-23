import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"
import { useState } from "react"

export default function({items}){
    const [showAllItem, showAllItemState] = useState(true)
    const [showLowItem, showLowItemState] = useState(false)
    const [showHighItem, showHighItemState] = useState(false)
    return(
        <div className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}
>
            <Layout>
                <SidebarLayout>
            <div className="flex justify-center">
                <button onClick={()=>{showAllItemState(true); showHighItemState(false); showLowItemState(false)}} type="button" className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    All Item
                </button>

                <button onClick={()=>{showLowItemState(true); showAllItemState(false); showHighItemState(false)}} type="button" className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Low Stock
                </button>
                <button onClick={()=>{showHighItemState(true); showAllItemState(false); showLowItemState(false)}} type="button" className="bg-blue-600 m-5 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    High Stock
                </button>
            </div>

            <div>
                {showAllItem && items.map(item =>(
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                        <p className="text-sm text-gray-600"><span className="font-medium">Product Name:</span> {item.product_name}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Barcode:</span> {item.barcode}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    </div>
                ))}

                {showLowItem && items.filter(item => item.quantity <= 30).map(item =>(
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                        <p className="text-sm text-gray-600"><span className="font-medium">Product Name:</span> {item.product_name}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Barcode:</span> {item.barcode}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    </div>
                ))}

                {showHighItem && items.filter(item => item.quantity >= 30).map(item =>(
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-2">
                        <p className="text-sm text-gray-600"><span className="font-medium">Product Name:</span> {item.product_name}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Barcode:</span> {item.barcode}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                </div>
                ))}
            </div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}