<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\RequestAudit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    public function scanPage(){
        return inertia('AdminDashboard/Scanner');
    }

    public function employeeProfilePage(){
        return inertia('Employee/Profile');
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
        $item = Item::whereBarcodeContains($request->barcode)->first();

        if (! $item) {
            return back()->with('error', 'Product not found');
        }

        return back()->with('success', $item);
    }

    public function searchPage($barcodes = null)
    {
        if (! $barcodes) {
            return inertia('AdminDashboard/Search');
        }

        if (is_string($barcodes)) {
            $barcodes = explode(',', $barcodes);
        }

        $barcodes = array_values(array_filter(array_map('trim', $barcodes), fn ($b) => $b !== ''));

        if (count($barcodes) === 0) {
            return inertia('AdminDashboard/Search');
        }

        $items = Item::query()
            ->where(function ($q) use ($barcodes) {
                foreach ($barcodes as $b) {
                    $q->orWhereJsonContains('barcode', $b);
                }
            })
            ->get()
            ->unique('id')
            ->values();

        if ($items->isEmpty()) {
            return inertia('AdminDashboard/Search', [
                'error' => 'Product not found',
            ]);
        }
        
        return inertia('AdminDashboard/Search', ['items' => $items]);
    }
    public function create_item(Request $request){
        $items = $request->validate([
            'barcode' => 'required|array',
            'product_name' => 'required',
            'quantity_piece' => 'required|integer|min:0',
            'status' => 'required',
            'break' => 'required',
        ]);

        $barcodes = array_values(array_filter(
            $items['barcode'],
            fn ($b) => $b !== null && trim((string) $b) !== ''
        ));

        if (count($barcodes) === 0) {
            return back()->withErrors(['barcode' => 'Add at least one barcode.']);
        }

        $items['barcode'] = $barcodes;
        $items['quantity_pack'] = count($barcodes);

        Item::assertUniqueBarcodes($barcodes);

        Item::create($items);
        return redirect()->route('admin_page');
    }

    /**
     * Move one barcode to break inventory: either split off from a multi-barcode item
     * or convert a single-barcode row into a break item (all packs become distributable pieces).
     */
    public function splitBarcodeBreak(Request $request, $id)
    {
        $request->validate([
            'barcode' => 'required|string',
        ]);

        $item = Item::findOrFail($id);

        if ($item->computeAggregateStatus() !== 'active' || $item->break !== 'not_break') {
            return back()->withErrors(['barcode' => 'This item cannot be broken.']);
        }

        $codes = array_values(array_filter(
            $item->barcode ?? [],
            fn ($c) => $c !== null && trim((string) $c) !== ''
        ));

        if (! in_array($request->barcode, $codes, true)) {
            return back()->withErrors(['barcode' => 'That barcode is not part of this item.']);
        }

        if (count($codes) === 1) {
            DB::transaction(function () use ($item) {
                $pieces = max(0, $item->quantity_pack * $item->quantity_piece);
                $item->ensureStatusesAligned();
                $slot = (is_array($item->statuses) && isset($item->statuses[0]))
                    ? $item->statuses[0]
                    : (($item->status === 'inactive') ? 'inactive' : 'active');
                $item->break = 'break';
                $item->quantity_pack = $pieces;
                $item->break_initial_pieces = $pieces;
                if (is_array($item->barcode) && count($item->barcode) === 1) {
                    $item->statuses = [$slot === 'inactive' ? 'inactive' : 'active'];
                }
                $item->save();
            });

            return back()->with('success', 'Item moved to break items. Distribute pieces from the Break Items page.');
        }

        Item::assertUniqueBarcodes([$request->barcode], $item->id);

        DB::transaction(function () use ($request, $item, $codes) {
            $oldCodes = $codes;
            $oldStatuses = $item->statuses ?? [];
            if (count($oldStatuses) !== count($oldCodes)) {
                $slot = ($item->status === 'inactive') ? 'inactive' : 'active';
                $oldStatuses = array_fill(0, count($oldCodes), $slot);
            }

            $remaining = array_values(array_filter(
                $oldCodes,
                fn ($c) => $c !== $request->barcode
            ));

            $newStatuses = [];
            foreach ($remaining as $c) {
                $idx = array_search($c, $oldCodes, true);
                $newStatuses[] = ($idx !== false && isset($oldStatuses[$idx])) ? $oldStatuses[$idx] : 'active';
            }

            $item->barcode = $remaining;
            $item->statuses = $newStatuses;
            $item->quantity_pack = max(0, $item->quantity_pack - 1);
            $item->save();

            $splitPieces = max(0, $item->quantity_piece);

            Item::create([
                'barcode' => [$request->barcode],
                'statuses' => ['active'],
                'product_name' => $item->product_name,
                'quantity_pack' => $splitPieces,
                'quantity_piece' => $item->quantity_piece,
                'status' => 'active',
                'break' => 'break',
                'break_initial_pieces' => $splitPieces,
            ]);
        });

        return back()->with('success', 'This barcode was moved to break items.');
    }

    public function update_status($barcode){
        $item = Item::whereBarcodeContains($barcode)->first();

        if(! $item){
            return back()->with('error', 'Product not found');
        }

        $item->setBarcodeStatus($barcode, 'inactive');
        $item->save();

        return back()->with('success', 'Product status updated to inactive');

    }

    public function inactive_items_page()
    {
        $items = Item::orderBy('id')->get();

        return inertia('AdminDashboard/InactiveItems', ['items' => $items]);
    }

    public function employeePage(){
        $users = Auth::user();

        return inertia('Employee/Index', [
            'users' => $users,
        ]);
    }

    public function submitRequest(Request $request){
        $request->validate([
            'message' => 'required|array',
            'request_type' => 'required|in:single,multiple',
            'request_quantity' => 'required|array',
        ]);

        $req = ItemRequest::create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'request_type' => $request->request_type,
            'request_quantity' => $request->request_quantity,
        ]);

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

        return inertia('AdminDashboard/Requests', [
            'requests' => $requests,
            'breakItems' => $this->adminBreakStockItems(),
        ]);
    }

    /**
     * Active break rows with pieces left (for admin to allocate on single requests).
     */
    protected function adminBreakStockItems()
    {
        return Item::query()
            ->where('break', 'break')
            ->where('status', 'active')
            ->where('quantity_pack', '>', 0)
            ->orderBy('product_name')
            ->get();
    }

    public function saveBreakAllocation($id, Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $req = ItemRequest::findOrFail($id);

        if ($req->request_type !== 'single') {
            return back()->withErrors(['allocation' => 'Only single requests use break allocations.']);
        }

        if (! in_array($req->status, ['pending', 'approved'], true)) {
            return back()->withErrors(['allocation' => 'Allocation can only be saved while the request is pending or approved.']);
        }

        $item = Item::findOrFail($request->integer('item_id'));
        if ($item->break !== 'break' || $item->computeAggregateStatus() !== 'active') {
            return back()->withErrors(['allocation' => 'Choose an active break item.']);
        }

        $qty = $request->integer('quantity');
        if ($qty > $item->quantity_pack) {
            return back()->withErrors(['allocation' => 'Not enough pieces available for this break item.']);
        }

        $codes = $item->barcode ?? [];
        $barcodeLabel = is_array($codes) && count($codes) > 0 ? (string) $codes[0] : '';

        $req->admin_break_allocations = [[
            'item_id' => $item->id,
            'quantity' => $qty,
            'product_name' => $item->product_name,
            'barcode' => $barcodeLabel,
        ]];
        $req->save();

        return back()->with('success', 'Break item allocation saved.');
    }

    public function verifyRequestItem($id, Request $request){
        $request->validate([
            'barcode' => 'required|string',
        ]);

        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'pending') {
            return back()->withErrors(['barcode' => 'Only pending requests can be verified.']);
        }

        if ($req->request_type === 'single') {
            return back()->withErrors([
                'barcode' => 'Single requests are fulfilled from break inventory. Use Approve or Reject without scanning.',
            ]);
        }

        $item = Item::whereBarcodeContains($request->barcode)->first();

        if (! $item) {
            return back()->withErrors(['barcode' => 'Product not found for this barcode.']);
        }

        if ($item->break === 'break') {
            return back()->withErrors([
                'barcode' => 'This is a break item. It cannot be added to a multiple request.',
            ]);
        }

        if (! $item->barcodeIsActive($request->barcode)) {
            return back()->withErrors(['barcode' => 'This item is not available (not active in inventory).']);
        }

        $barcodes = $req->item_barcodes ?? [];
        if (in_array($request->barcode, $barcodes, true)) {
            return back()->withErrors(['barcode' => 'This item has already been added to this request.']);
        }

        $barcodes[] = $request->barcode;
        $req->item_barcodes = array_values($barcodes);
        $req->save();

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'item_verified_added',
            'from_status' => $req->status,
            'to_status' => $req->status,
            'metadata' => [
                'barcode' => $request->barcode,
                'product_name' => $item->product_name,
            ],
        ]);

        return back()->with('success', 'Item verified and added to this request. It will be set to inactive when the request is marked issued.');
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
            if ($req->request_type === 'multiple') {
                $barcodes = $req->item_barcodes ?? [];
                if (count($barcodes) === 0) {
                    return back()->withErrors(['status' => 'Scan and verify at least one available item before approving.']);
                }

                foreach ($barcodes as $b) {
                    $inv = Item::whereBarcodeContains($b)->first();
                    if (! $inv || ! $inv->barcodeIsActive($b)) {
                        return back()->withErrors(['status' => 'One or more verified items are no longer active/available.']);
                    }
                }

                // Barcodes stay active until the request is marked issued (same idea as single flow timing).
            } elseif ($req->request_type === 'single') {
                $alloc = $req->admin_break_allocations ?? [];
                if (! is_array($alloc) || count($alloc) === 0) {
                    return back()->withErrors(['status' => 'Save a break item and piece count before approving.']);
                }

                DB::beginTransaction();
                try {
                    foreach ($alloc as $line) {
                        $item = Item::lockForUpdate()->findOrFail($line['item_id']);
                        if ($item->break !== 'break' || $item->computeAggregateStatus() !== 'active') {
                            DB::rollBack();

                            return back()->withErrors(['status' => 'The allocated break item is no longer available.']);
                        }
                        $qty = (int) ($line['quantity'] ?? 0);
                        if ($qty < 1 || $qty > $item->quantity_pack) {
                            DB::rollBack();

                            return back()->withErrors(['status' => 'Not enough break stock to approve this request.']);
                        }
                        $item->quantity_pack -= $qty;
                        $item->save();
                    }
                    DB::commit();
                } catch (\Throwable $e) {
                    DB::rollBack();
                    throw $e;
                }
            }

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

        if ($req->request_type === 'single') {
            $alloc = $req->admin_break_allocations ?? [];
            if (! is_array($alloc) || count($alloc) === 0) {
                return back()->withErrors(['status' => 'Choose a break item and quantity before marking issued.']);
            }
        }

        DB::beginTransaction();
        try {
            if ($req->request_type === 'multiple') {
                $barcodes = $req->item_barcodes ?? [];
                if (count($barcodes) === 0) {
                    DB::rollBack();

                    return back()->withErrors(['status' => 'No verified barcodes to issue for this request.']);
                }
                foreach ($barcodes as $b) {
                    $inv = Item::lockForUpdate()->whereBarcodeContains($b)->first();
                    if (! $inv || ! $inv->barcodeIsActive($b)) {
                        DB::rollBack();

                        return back()->withErrors(['status' => 'One or more items are no longer active; cannot mark issued.']);
                    }
                }
                foreach ($barcodes as $b) {
                    $inv = Item::whereBarcodeContains($b)->first();
                    if ($inv) {
                        $inv->setBarcodeStatus($b, 'inactive');
                        $inv->save();
                    }
                }
            }

            $req->status = 'issued';
            $req->issued_at = now();
            $req->save();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        RequestAudit::create([
            'request_id' => $req->id,
            'actor_user_id' => $request->user()->id,
            'action' => 'marked_issued',
            'from_status' => $fromStatus,
            'to_status' => 'issued',
            'metadata' => [
                'verified_barcodes' => $req->item_barcodes ?? [],
                'admin_break_allocations' => $req->admin_break_allocations ?? [],
            ],
        ]);

        return back()->with('success', 'Request marked as issued.');
    }

    public function cancelRequestIssuance($id, Request $request){
        $req = ItemRequest::findOrFail($id);

        if ($req->status !== 'approved') {
            return back()->withErrors(['status' => 'Only approved requests can have their issuance cancelled.']);
        }

        $barcodes = $req->item_barcodes ?? [];

        if ($req->request_type === 'single') {
            $alloc = $req->admin_break_allocations ?? [];
            foreach ($alloc as $line) {
                $item = Item::find($line['item_id'] ?? null);
                if ($item) {
                    $item->quantity_pack += (int) ($line['quantity'] ?? 0);
                    $item->save();
                }
            }
        } else {
            foreach ($barcodes as $b) {
                $inv = Item::whereBarcodeContains($b)->first();
                if ($inv) {
                    $inv->setBarcodeStatus($b, 'active');
                    $inv->save();
                }
            }
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
            'breakItems' => $this->adminBreakStockItems(),
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

        if ($req->request_type === 'single') {
            return back()->withErrors(['barcode' => 'Single (break) requests are not modified by removing scanned items.']);
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

        if ($item->break !== 'break') {
            return back()->withErrors(['quantity_pack' => 'Only break items can be updated here.']);
        }

        $request->validate([
            'quantity_pack' => 'required|integer|min:0',
        ]);

        $item->quantity_pack = $request->integer('quantity_pack');
        $item->save();

        return back()->with('success', 'Quantity updated.');
    }

    /**
     * Convert a break line back to pack-based stock only if piece count was never reduced from when it was broken.
     */
    public function unbreakBreakItem(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        if ($item->break !== 'break') {
            return back()->withErrors(['unbreak' => 'Only break items can be unbroken.']);
        }

        if ($item->break_initial_pieces === null) {
            return back()->withErrors(['unbreak' => 'This line cannot be unbroken (missing original piece snapshot).']);
        }

        if ($item->quantity_pack !== (int) $item->break_initial_pieces) {
            return back()->withErrors(['unbreak' => 'Pieces have been distributed; this item can no longer be restored as a pack.']);
        }

        $piece = max(1, (int) $item->quantity_piece);
        if ($item->break_initial_pieces % $piece !== 0) {
            return back()->withErrors(['unbreak' => 'Cannot derive a whole pack count from the current piece totals.']);
        }

        $packs = (int) ($item->break_initial_pieces / $piece);

        $item->break = 'not_break';
        $item->quantity_pack = $packs;
        $item->break_initial_pieces = null;
        $item->save();

        return back()->with('success', 'Item restored as pack-based stock.');
    }
}
