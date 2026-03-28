<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\RequestAudit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    public function scanPage(){
        return inertia('AdminDashboard/Scanner');
    }

    public function createUserPage(){
        $users = User::all();
        return inertia('AdminDashboard/CreateUser', ['users' => $users]);
    }

    public function adminPage(){
        return inertia('AdminDashboard/Index');
    }

    public function itemPage(){
        $items = Item::all();
        return inertia('AdminDashboard/Items', ['items' => $items]);
    }

    public function breakItemsPage(){
        $items = Item::where('break', 'break')->get();
        return inertia('AdminDashboard/BreakItems', ['items' => $items]);
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
            'quantity_pack' => 'required',
            'quantity_piece' => 'required',
            'status' => 'required',
            'break' => 'required',

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
        $users = Auth::user();
        return inertia('Employee/Index', ['users' => $users]);
    }

    public function submitRequest(Request $request){
        $request->validate([
            'message' => 'required|array',
            'request_type' => 'required',
            'request_quantity' => 'required|array'
        ]);

        $req = \App\Models\Request::create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'request_type' => $request->request_type,
            'request_quantity' => $request->request_quantity,
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
            'message' => 'nullable|string|max:1000',
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
                'admin_message' => $request->message,
            ],
        ]);

        // Send notification to the requester if a message is provided
        if ($request->filled('message')) {
            $req->user->notify(new \App\Notifications\AdminMessageNotification($req, $request->message, $toStatus));
        }

        return back()->with('success', 'Request updated');
    }

    public function markRequestIssued($id, Request $request){
        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'approved') {
            return back()->withErrors(['status' => 'Only approved requests can be marked as issued.']);
        }

        $fromStatus = $req->status;
        $req->status = 'issued';
        $req->issued_at = now();
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'marked_issued',
            'from_status' => $fromStatus,
            'to_status' => 'issued',
            'metadata' => [
                'verified_barcodes' => $req->item_barcodes ?? [],
            ],
        ]);

        return back()->with('success', 'Request marked as issued.');
    }

    public function cancelRequestIssuance($id, Request $request){
        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'approved') {
            return back()->withErrors(['status' => 'Only approved requests can have their issuance cancelled.']);
        }

        // Set items back to active
        $barcodes = $req->item_barcodes ?? [];
        if (count($barcodes) > 0) {
            Item::whereIn('barcode', $barcodes)->update(['status' => 'active']);
        }

        $fromStatus = $req->status;
        $req->status = 'issuance_cancelled';
        $req->issuance_cancelled_at = now();
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'issuance_cancelled',
            'from_status' => $fromStatus,
            'to_status' => 'issuance_cancelled',
            'metadata' => [
                'verified_barcodes' => $barcodes,
                'items_reactivated' => count($barcodes),
            ],
        ]);

        return back()->with('success', 'Issuance cancelled and items reactivated.');
    }

    public function employeeMyRequestsPage(Request $request){
        $requests = ItemRequest::query()
            ->where('user_id', $request->user()->id)
            ->with(['user'])
            ->orderByDesc('created_at')
            ->get();

        // Load admin messages for each request
        foreach ($requests as $req) {
            $adminMessage = $request->user()
                ->notifications()
                ->where('type', \App\Notifications\AdminMessageNotification::class)
                ->whereJsonContains('data->request_id', $req->id)
                ->latest()
                ->first();

            $req->admin_message = $adminMessage ? $adminMessage->data['admin_message'] : null;
        }

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

    public function receiptPreview($id, Request $request){
        $req = ItemRequest::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'approved')
            ->with('user')
            ->firstOrFail();

        $verifiedItems = $req->verified_items;

        return inertia('Employee/ReceiptPreview', [
            'request' => $req,
            'items' => $verifiedItems,
            'user' => $request->user(),
        ]);
    }

    public function generateReceipt($id, Request $request){
        $req = ItemRequest::query()
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'approved')
            ->with('user')
            ->firstOrFail();

        $verifiedItems = $req->verified_items;

        // Generate a simple HTML receipt
        $html = view('receipt', [
            'request' => $req,
            'items' => $verifiedItems,
            'user' => $request->user(),
        ])->render();

        return response($html, 200)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="receipt_' . $req->id . '.html"');
    }

    public function requestsDonePage(Request $request){
        $filter = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = ItemRequest::with('user')
            ->whereIn('status', ['approved', 'rejected', 'issued', 'issuance_cancelled']);

        if (in_array($filter, ['approved', 'rejected', 'issued', 'issuance_cancelled'])) {
            $query->where('status', $filter);
        }

        if (!empty($search)) {
            $query->where('id', $search);
        }

        $requests = $query
            ->orderByDesc('created_at')
            ->get();

        return inertia('AdminDashboard/DoneRequests', [
            'requests' => $requests,
            'filter' => $filter,
            'search' => $search,
        ]);
    }

    public function auditLogsPage(){
        $logs = RequestAudit::with(['actor', 'request.user'])
            ->orderByDesc('created_at')
            ->get();

        return inertia('AdminDashboard/AuditLogs', ['logs' => $logs]);
    }

    public function removeVerifiedItem($requestId, Request $request){
        $request->validate([
            'barcode' => 'required|string',
        ]);

        $req = ItemRequest::findOrFail($requestId);

        if ($req->status !== 'pending') {
            return back()->withErrors(['barcode' => 'Only pending requests can be modified.']);
        }

        $barcodes = $req->item_barcodes ?? [];
        if (!in_array($request->barcode, $barcodes, true)) {
            return back()->withErrors(['barcode' => 'This item is not part of the verified items for this request.']);
        }

        $updatedBarcodes = array_values(array_filter($barcodes, function($b) use ($request) {
            return $b !== $request->barcode;
        }));

        $req->item_barcodes = $updatedBarcodes;
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'item_verified_removed',
            'from_status' => $req->status,
            'to_status' => $req->status,
            'metadata' => [
                'removed_barcode' => $request->barcode,
            ],
        ]);

        return back()->with('success', 'Item removed from verified list for this request.');
    }

    public function updateBreakItem(Request $request, $id){
        $item = Item::findOrFail($id);

        $request->validate([
            'quantity_pack' => 'required|integer|min:0',
        ]);

        $item->quantity_pack = $request->quantity_pack;
        $item->save();

        return back()->with('success', 'Item break status updated.');
    }
}
