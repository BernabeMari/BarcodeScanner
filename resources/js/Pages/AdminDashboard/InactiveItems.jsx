import Layout from "../../Layouts/Layout";
import SidebarLayout from "../../Layouts/sidebarLayout";

export default function({items}){
    return(
        <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}
>
            <Layout>
                <SidebarLayout>
                <div>
                    {items.map(item =>(
                       <div className="p-4 bg-white bg-opacity-80 font-bold rounded-lg shadow-md m-4"> {item.status === "inactive" && (
                            <div key={item.id}>
                                Product: {item.product_name}
                                <br />
                                Quantity: {item.quantity}
                                <br />
                                Barcode: {item.barcode}
                            </div>
                        )}
                        </div>
                    ))}
                </div>
                </SidebarLayout>
            </Layout>
        </div>
    )
}
