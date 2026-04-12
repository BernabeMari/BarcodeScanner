import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import SidebarLayout from "@/Layouts/sidebarLayout"
import Layout from "@/Layouts/Layout"

export default function Index() {
  const [showMultipleModal, showMultipleModalset] = useState(false)
  const [showSingleModal, showSingleModalset] = useState(true)
  const { post, data: itemData, setData: setItemData, reset: resetItemForm } = useForm({
    barcode: [""],
    product_name: '',
    quantity_pack: 0,
    quantity_piece: 0,
    status: 'active',
    break: 'not_break',
    item_type: '',
    item_type_custom: '',
  })
  const itemType = itemData.item_type === "Other" ?
  itemData.item_type_custom : itemData.item_type
  
  useEffect(() => {
    const n = itemData.barcode.filter((x) => String(x).trim() !== "").length
    setItemData("quantity_pack", n)
  }, [itemData.barcode, setItemData])

  function submit_item(e) {
    e.preventDefault()
    post(route('create_item'),{
    onSuccess: () => {
      resetItemForm()
      showMultipleModalset(true)
      showSingleModalset(false)
    }})
  }

  function submit_single_item(e) {
    e.preventDefault()
    post(route('create_single_item'),{
    onSuccess: () => {
      resetItemForm()
      showMultipleModalset(true)
      showSingleModalset(false)
    }})
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
      <Layout>
        <SidebarLayout>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold text-slate-900 mb-4">Create inventory item</h1>
            <div className="flex gap-2 mb-6">
            <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => {showSingleModalset(true); showMultipleModalset(false)}}>Single</button>
            <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => {showMultipleModalset(true); showSingleModalset(false)}}>Multiple</button>
            </div>
            <div className="flex justify-center items-center">
                {showSingleModal && (
                  <form onSubmit={submit_single_item} className="flex flex-col m-5 text-slate-800 max-w-lg w-full">
                    <p className="font-medium">Barcodes (quantity / piece = number of barcodes)</p>
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
                
                <select value={itemData.item_type} onChange={(e) => setItemData('item_type', e.target.value)} className="border p-2 mt-3 text-black">
                  <option value="" disabled>Select Options</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Box">Box</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Ream">Ream</option>
                  <option value="Unit">Unit</option>
                  <option value="Other">Others...</option>
                  </select>
                  {itemData.item_type === "Other" && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    className="border p-2 mt-2 text-black"
                    value={itemData.item_type_custom}
                    onChange={(e) => setItemData('item_type_custom', e.target.value)}
                  />
                )}
                
                <input type="number" value={itemData.quantity_piece} onChange={(e) => setItemData('quantity_piece', e.target.value)} placeholder="Pieces per pack" className="border p-2 text-black" min={0} />
                <select readOnly value={itemData.status} onChange={(e) => setItemData('status', e.target.value)} className="border p-2 mt-3 text-black">
                  <option value="active">Active</option>
                </select>
                <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 py-2 rounded">Create</button>
              
                  </form>
                )}
                
                {showMultipleModal && (
                  <form onSubmit={submit_item} className="flex flex-col m-5 text-slate-800 max-w-lg w-full">
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
                
                <select value={itemData.item_type} onChange={(e) => setItemData('item_type', e.target.value)} className="border p-2 mt-3 text-black">
                  <option value="" disabled>Select Options</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Box">Box</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Ream">Ream</option>
                  <option value="Unit">Unit</option>
                  <option value="Other">Others...</option>
                  </select>
                  {itemData.item_type === "Other" && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    className="border p-2 mt-2 text-black"
                    value={itemData.item_type_custom}
                    onChange={(e) => setItemData('item_type_custom', e.target.value)}
                  />
                )}
                
                <input type="number" value={itemData.quantity_piece} onChange={(e) => setItemData('quantity_piece', e.target.value)} placeholder="Pieces per pack" className="border p-2 text-black" min={0} />
                <select readOnly value={itemData.status} onChange={(e) => setItemData('status', e.target.value)} className="border p-2 mt-3 text-black">
                  <option value="active">Active</option>
                </select>
                <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 py-2 rounded">Create</button>
              </form>
                )}
            </div>
          </div>
        </SidebarLayout>
      </Layout>
  );
}
