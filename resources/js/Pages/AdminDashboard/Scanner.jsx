import { router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"

export default function Index() {
  const { post, data: itemData, setData: setItemData, reset: resetItemForm } = useForm({
    barcode: [""],
    product_name: '',
    quantity_pack: 0,
    quantity_piece: 0,
    status: 'active',
    break: 'not_break'
  })

  useEffect(() => {
    const n = itemData.barcode.filter((x) => String(x).trim() !== "").length
    setItemData("quantity_pack", n)
  }, [itemData.barcode, setItemData])

  function submit_item(e) {
    e.preventDefault()
    post(route('create_item'), {
      onSuccess: () => router.visit(route('admin_page')),
    })
  }

  function handleScan(scannedBarcode) {
    const trimmed = String(scannedBarcode).trim()
    if (!trimmed) {
      return
    }
    const next = [...itemData.barcode]
    const emptyIdx = next.findIndex((x) => !String(x).trim())
    if (emptyIdx >= 0) {
      next[emptyIdx] = trimmed
    } else {
      next.push(trimmed)
    }
    setItemData("barcode", next)
    router.post("/scan-product", { barcode: trimmed }, {
      onSuccess: () => resetItemForm(),
    })
  }

  function addBarcodeRow() {
    setItemData("barcode", [...itemData.barcode, ""])
  }

  function updateBarcodeAt(index, value) {
    const next = [...itemData.barcode]
    next[index] = value
    setItemData("barcode", next)
  }

  return (
    <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')" }}>

      <Layout>
        <SidebarLayout>

          <div>
            <div className="flex justify-center items-center">
              <form onSubmit={submit_item} className="flex flex-col m-5 text-white max-w-lg w-full">
                <p className="font-medium">Barcodes (quantity / pack = number of barcodes)</p>
                {itemData.barcode.map((row, index) => (
                  <div key={index} className="flex flex-row gap-2 my-1">
                    <input
                      type="text"
                      value={row}
                      onChange={(e) => updateBarcodeAt(index, e.target.value)}
                      className="border p-2 w-full text-black"
                      autoFocus={index === 0}
                    />
                    <button type="button" onClick={addBarcodeRow} className="bg-blue-600 px-3 rounded text-sm shrink-0">
                      Add
                    </button>
                  </div>
                ))}
                <p className="mt-3 text-sm opacity-90">
                  Quantity / pack: <strong>{itemData.quantity_pack}</strong> (auto)
                </p>
                <p className="mt-4">Enter Item&apos;s Name</p>
                <input type="text" value={itemData.product_name} onChange={(e) => setItemData('product_name', e.target.value)} placeholder="Enter Name" className="border p-2 text-black" />
                <p className="mt-3">Enter Number of piece/s per pack</p>
                <input type="number" value={itemData.quantity_piece} onChange={(e) => setItemData('quantity_piece', e.target.value)} placeholder="Pieces per pack" className="border p-2 text-black" min={0} />
                <select readOnly value={itemData.status} onChange={(e) => setItemData('status', e.target.value)} className="border p-2 mt-3 text-black">
                  <option value="active">Active</option>
                </select>
                <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 py-2 rounded">Create</button>
              </form>
            </div>
            <div className="px-5 pb-8 text-white">
              <p className="text-sm mb-2">Scan to look up product (optional)</p>
              <input
                type="text"
                className="border p-2 w-full max-w-lg text-black"
                placeholder="Scan barcode"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScan(e.target.value)
                    e.target.value = ""
                  }
                }}
              />
            </div>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
}
