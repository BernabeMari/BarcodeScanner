import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import BarcodeScanner from "@/Components/BarcodeScanner";
import { router, useForm } from "@inertiajs/react";

export default function Search({ item, error }) {
    const {setData} = useForm({
        status: '',
    })

    function handleScan(scannedBarcode) {
        router.get(route('search_page', { barcode: scannedBarcode }));
    }

    function get(){
        setData('status', 'inactive' )
    }

    return (
        <Layout>
            <SidebarLayout>
                <div>
                    <div>
                        <BarcodeScanner onScan={handleScan} />

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
                                        <button type="button">Get</button>
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