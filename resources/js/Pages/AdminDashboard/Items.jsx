import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"
import { useState } from "react"

export default function({items}){
    const [showItem, showItemState] = useState(false)
    return(
        <div>
            <Layout>
                <SidebarLayout>
            <div className="min-h-screen flex justify-center">
                <div className="p-5">
                    <table className="flex flex-row border border-black rounded-3xl0">
                    <tr className="m-20 mr-20 mt-0">
                        <p className="text-center">Low</p>
                        
                        {items.filter(item => item.quantity <= 20).map(item => (
                            <div key={item.id}>
                        <td  className="border w-1/3 border-black">
                              {item.product_name} - {item.quantity}
                            
                            </td>      
                            </div>
                ))}
                        
                    </tr>
                    <tr className="m-20 mr-20 mt-0">
                        <p className="text-center">mid</p>
                        {items.filter(item => item.quantity > 20 && item.quantity <= 50).map(item => (
                            <div key={item.id}>
                        <td className="border w-1/3 border-black">
                                {item.product_name} - {item.quantity}
                        </td>
                            </div>
                ))}
                    </tr>
                    <tr className="ml-20 mr-20 mt-0">
                        <p className="text-center">high</p>
                        {items.filter(item => item.quantity > 50 && item.quantity <= 101).map(item => (
                            <div key={item.id}>
                            <td className="border border-black w-1/3"> 
                                {item.product_name} - {item.quantity}
                            </td>
                            </div>
                ))}     
                    </tr>
                </table>
                </div>

            </div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}