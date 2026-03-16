import Layout from "@/Layouts/Layout"
import SidebarLayout from "@/Layouts/sidebarLayout"
import BarcodeScanner from "@/Components/BarcodeScanner";
import { router } from "@inertiajs/react";

export default function Search({ item, error }) {
    function handleScan(scannedBarcode) {
        router.get(route('search_page', { barcode: scannedBarcode }));
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