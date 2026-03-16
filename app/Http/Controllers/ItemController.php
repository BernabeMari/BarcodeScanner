<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function scanPage(){
        return inertia('AdminDashboard/Index');
    }

    public function scan(Request $request)
    {
        
    $item = Item::where('barcode', $request->barcode)->first();

    if(!$item){
        return back()->with('error', 'Product not found');
    }

    return back()->with('success', $item);
    }

    public function create_item(Request $request){
        $items = $request->validate([
            'barcode' => 'required',
            'product_name' => 'required',
            'quantity' => 'required',
        ]);

        Item::create($items);
        return redirect()->route('admin_page');
    }
}
