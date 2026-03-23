import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { router, useForm } from "@inertiajs/react";

export default function Search({ item, error }) {
    const { setData: setStatus } = useForm({
        status: '',
    })


    function handleScan(scannedBarcode) {
        router.get(route('search_page', { barcode: scannedBarcode }));
    }

    return (
                <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')"  }}
>
        <Layout>
            <SidebarLayout>
                    <div>
                 <input type="text" placeholder="Scan barcode" autoFocus onKeyDown={(e) => {
      if (e.key === "Enter") {
      handleScan(e.target.value);
      e.target.value = ""; 
    }
  }}
/>

                        {error ? (
                            <div className="mt-4 text-red-600">{error}</div>
                        ) : item ? (
                            <div className="mt-4">
                                <div className="font-semibold">Item found:</div>
                                <div>Name: {item.product_name}</div>
                                <div>Barcode: {item.barcode}</div>
                                <div>Quantity: {item.quantity}</div>
                                <div>Department: {item.department}</div>
                                <div>{item.status === 'active' ? (
                                    <span className="bg-green-500 text-white px-2 py-1 rounded">Active</span>
                                ) : (
                                    <span className="bg-red-500 text-white px-2 py-1 rounded">Inactive</span>
                                )}</div>
                            </div>
                        ) : (
                            <div className="mt-4 text-gray-500">Scan a barcode to see the result.</div>
                        )}
                    </div>
            </SidebarLayout>
        </Layout>
                </div>
    )
}