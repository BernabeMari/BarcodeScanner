import Layout from "../../Layouts/Layout";
import SidebarLayout from "../../Layouts/sidebarLayout";

export default function({items}){
    return(
        <div>
            <Layout>
                <SidebarLayout>
                <div>
                    {items.map(item =>(
                       <div> {item.status === "inactive" && (
                            <div key={item.id}>
                                {item.product_name} - {item.quantity}
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
