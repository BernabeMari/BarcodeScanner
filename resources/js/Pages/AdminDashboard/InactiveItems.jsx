import Layout from "../../Layouts/Layout";
import SidebarLayout from "../../Layouts/sidebarLayout";
import { formatBarcodes } from "@/utils/formatBarcodes";

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
                                Quantity / Pack: {item.quantity_pack}
                                <br />
                                Quantity / Piece: {item.quantity_piece}
                                <br />
                                Barcode: {formatBarcodes(item.barcode)}
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
