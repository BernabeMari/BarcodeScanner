import { router, useForm } from "@inertiajs/react";
import { useState } from "react";
import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"

export default function Index() {
  const [barcode, setBarcode] = useState("");
  const {post, data: itemData, setData: setItemData, reset: resetItemForm} = useForm({
    barcode: '',
    product_name: '',
    quantity: 0,
    status: 'active',
  })

  function submit_item(e){
    e.preventDefault()
    post(route('create_item'), {
      onSuccess:()=>router.visit(route('admin_page'))
    })
  }

  // This function runs when the scanner detects a barcode
  function handleScan(scannedBarcode) {
    setBarcode(scannedBarcode); // display in the text field
    setItemData("barcode", scannedBarcode)
    router.post("/scan-product", { barcode: scannedBarcode },{
      onSuccess: () => resetItemForm()
    }); // send to Laravel
  }

  return (

    <Layout>
      <SidebarLayout>
        <div className="min-h-screen">

      <input type="text" placeholder="Scan barcode" autoFocus onKeyDown={(e) => {
      if (e.key === "Enter") {
      handleScan(e.target.value);
      e.target.value = ""; 
    }
  }}
/>

      {/* Text field shows scanned barcode */}
      <div>
        {barcode && (
          <div className="flex justify-center items-center">
          <form onSubmit={submit_item} className="flex flex-col">
              <input type="text" value={itemData.barcode} onChange={(e)=>setItemData('barcode', e.target.value)} readOnly className="border p-2 w-full cursor-not-allowed" autoFocus/>
              <input type="text" value={itemData.product_name} onChange={(e)=>setItemData('product_name', e.target.value)} placeholder="Enter Name" />
              <input type="number" value={itemData.quantity} onChange={(e)=>setItemData('quantity', e.target.value)} placeholder="Quantity" />
              <select readOnly value={itemData.status} onChange={(e)=>setItemData('status', e.target.value)} className="border p-2">
                <option value="active">Active</option>
              </select>

              <button type="submit">Create</button>
          </form>
          </div>
        )}
      </div>
    </div>
        </SidebarLayout>
            </Layout>
  );
}