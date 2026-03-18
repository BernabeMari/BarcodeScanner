import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import { router, useForm } from "@inertiajs/react";

export default function Search({ item, error }) {
    const { setData: setStatus } = useForm({
        status: '',
    })

    function updateStatus(e){
        e.preventDefault()
        setStatus('inactive')
        router.post(route('update_status', { barcode: item.barcode }), {
            onSuccess: () => router.visit(route('search_page'))
        })
    }

    function handleScan(scannedBarcode) {
        router.get(route('search_page', { barcode: scannedBarcode }));
    }

    return (
        <Layout>
            <SidebarLayout>
                <div>
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
                                <div>Status: {item.status}</div>
                                
                                {item.status === 'active' && (
                                    <div>
                                        <button type="button" onClick={updateStatus}>
                                            Get
                                        </button>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="mt-4 text-gray-500">Scan a barcode to see the result.</div>
                        )}
                    </div>
                </div>
            </SidebarLayout>
        </Layout>
    )
}