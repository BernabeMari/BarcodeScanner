<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\RequestAudit;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function scanPage(){
        return inertia('AdminDashboard/Scanner');
    }

    public function createUserPage(){
        return inertia('AdminDashboard/CreateUser');
    }

    public function adminPage(){
        return inertia('AdminDashboard/Index');
    }

    public function itemPage(){
        $items = Item::all();
        return inertia('AdminDashboard/Items', ['items' => $items]);
    }

    public function scan(Request $request)
    {
        
    $item = Item::where('barcode', $request->barcode)->first();

    if(!$item){
        return back()->with('error', 'Product not found');
    }

    return back()->with('success', $item);
    }

  public function searchPage($barcode = null)
  {
      if (!$barcode) {
          return inertia('AdminDashboard/Search');
      }

      $item = Item::where('barcode', $barcode)->first();

      if (!$item) {
          return inertia('AdminDashboard/Search', [
              'error' => 'Product not found',
          ]);
      }

      return inertia('AdminDashboard/Search', ['item' => $item]);
  }
    public function create_item(Request $request){
        $items = $request->validate([
            'barcode' => 'required',
            'product_name' => 'required',
            'quantity' => 'required',
            'status' => 'required',
        ]);

        Item::create($items);
        return redirect()->route('admin_page');
    }

    public function update_status($barcode){
        $item = Item::where('barcode', $barcode)->first();

        if(!$item){
            return back()->with('error', 'Product not found');
        }

        $item->status = 'inactive';
        $item->save();

        return back()->with('success', 'Product status updated to inactive');

    }

    public function inactive_items_page(){
        $items = Item::where('status', 'inactive')->get();
        return inertia('AdminDashboard/InactiveItems', ['items' => $items]);
    }

    public function employeePage(){
        return inertia('Employee/Index');
    }

    public function submitRequest(Request $request){
        $request->validate([
            'message' => 'required|string',
        ]);

        $req = \App\Models\Request::create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
        ]);

        // Notify admins
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\NewRequestNotification($req));
        }

        return back()->with('success', 'Request submitted successfully');
    }

    public function requestsPage(){
        $requests = ItemRequest::with('user')
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return inertia('AdminDashboard/Requests', ['requests' => $requests]);
    }

    public function verifyRequestItem($id, Request $request){
        $request->validate([
            'barcode' => 'required|string',
        ]);

        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'pending') {
            return back()->withErrors(['barcode' => 'Only pending requests can be verified.']);
        }

        $item = Item::where('barcode', $request->barcode)->first();

        if (! $item) {
            return back()->withErrors(['barcode' => 'Product not found for this barcode.']);
        }

        if ($item->status !== 'active') {
            return back()->withErrors(['barcode' => 'This item is not available (not active in inventory).']);
        }

        $barcodes = $req->item_barcodes ?? [];
        if (in_array($item->barcode, $barcodes, true)) {
            return back()->withErrors(['barcode' => 'This item has already been added to this request.']);
        }

        $barcodes[] = $item->barcode;
        $req->item_barcodes = array_values($barcodes);
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'item_verified_added',
            'from_status' => $req->status,
            'to_status' => $req->status,
            'metadata' => [
                'barcode' => $item->barcode,
                'product_name' => $item->product_name,
            ],
        ]);

        return back()->with('success', 'Item verified and added to this request. It will be set to inactive on approval.');
    }

    public function updateRequest($id, Request $request){
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'pending') {
            return back()->withErrors(['status' => 'This request is no longer pending.']);
        }

        if ($request->status === 'approved') {
            $barcodes = $req->item_barcodes ?? [];
            if (count($barcodes) === 0) {
                return back()->withErrors(['status' => 'Scan and verify at least one available item before approving.']);
            }

            $matchingItems = Item::query()
                ->whereIn('barcode', $barcodes)
                ->where('status', 'active')
                ->count();

            if ($matchingItems !== count($barcodes)) {
                return back()->withErrors(['status' => 'One or more verified items are no longer active/available.']);
            }

            Item::whereIn('barcode', $barcodes)->update(['status' => 'inactive']);
            $req->approved_at = now();
            $req->rejected_at = null;
        } else {
            $req->rejected_at = now();
            $req->approved_at = null;
        }

        $fromStatus = $req->status;
        $toStatus = $request->status;
        $req->status = $toStatus;
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => $toStatus,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'metadata' => [
                'verified_barcodes' => $req->item_barcodes ?? [],
            ],
        ]);

        return back()->with('success', 'Request updated');
    }

    public function employeeMyRequestsPage(Request $request){
        $requests = ItemRequest::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return inertia('Employee/MyRequests', ['requests' => $requests]);
    }

    public function cancelRequest($id, Request $request){
        $req = ItemRequest::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($req->status !== 'pending') {
            return back()->withErrors(['status' => 'Only pending requests can be cancelled.']);
        }

        $fromStatus = $req->status;
        $req->status = 'cancelled';
        $req->cancelled_at = now();
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'cancelled',
            'from_status' => $fromStatus,
            'to_status' => 'cancelled',
            'metadata' => [
                'verified_barcodes' => $req->item_barcodes ?? [],
            ],
        ]);

        return back()->with('success', 'Request cancelled.');
    }

    public function requestsDonePage(Request $request){
        $filter = $request->query('status', 'all');

        $query = ItemRequest::with('user')
            ->whereIn('status', ['approved', 'rejected']);

        if ($filter === 'approved' || $filter === 'rejected') {
            $query->where('status', $filter);
        }

        $requests = $query
            ->orderByDesc('created_at')
            ->get();

        return inertia('AdminDashboard/DoneRequests', [
            'requests' => $requests,
            'filter' => $filter,
        ]);
    }

    public function auditLogsPage(){
        $logs = RequestAudit::with(['actor', 'request.user'])
            ->orderByDesc('created_at')
            ->get();

        return inertia('AdminDashboard/AuditLogs', ['logs' => $logs]);
    }
}
