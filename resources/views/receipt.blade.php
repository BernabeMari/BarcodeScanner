<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Item Issuance Receipt - Request #{{ $request->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 24px;
            line-height: 1.5;
            color: #222;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
        }
        .header p {
            margin: 4px 0 0;
            color: #555;
        }
        .info-section {
            margin-bottom: 22px;
        }
        .info-section h2 {
            font-size: 14px;
            margin: 0 0 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            vertical-align: top;
            padding: 4px 12px 4px 0;
        }
        .info-table td.label {
            font-weight: bold;
            width: 120px;
            white-space: nowrap;
        }
        .message-list {
            margin: 6px 0 0 18px;
            padding: 0;
        }
        .message-list li {
            margin-bottom: 4px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        .items-table th, .items-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }
        .items-table th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .signature-table {
            width: 100%;
            margin-top: 32px;
            border-collapse: collapse;
        }
        .signature-table td {
            width: 45%;
            vertical-align: top;
            text-align: center;
            padding: 0 8px;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 36px;
            padding-top: 6px;
        }
        .footer {
            margin-top: 28px;
            text-align: center;
            color: #666;
            font-size: 10px;
        }
    </style>
</head>
<body>
    @php
        $messageLines = is_array($request->message) ? $request->message : (array_filter([(string) $request->message]));
        $qtyLines = is_array($request->request_quantity) ? $request->request_quantity : [];
    @endphp

    <div class="header">
        <h1>Item Issuance Receipt</h1>
        <p>Request ID: #{{ $request->id }}</p>
        <p>Generated on: {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>

    <div class="info-section">
        <h2>Requester Information</h2>
        <table class="info-table">
            <tr>
                <td class="label">Name:</td>
                <td>{{ $user->username }}</td>
                <td class="label">Request Date:</td>
                <td>{{ $request->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
            <tr>
                <td class="label">Department:</td>
                <td>{{ $user->department ?? 'N/A' }}</td>
                <td class="label">Approved Date:</td>
                <td>{{ $request->approved_at?->format('F j, Y \a\t g:i A') ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="info-section">
        <h2>Request Details</h2>
        <p style="margin:0;"><strong>Request line(s):</strong></p>
        @if(count($messageLines) > 0)
            <ul class="message-list">
                @foreach($messageLines as $i => $line)
                    <li>
                        {{ $line }}
                        @if(array_key_exists($i, $qtyLines) && $qtyLines[$i] !== '' && $qtyLines[$i] !== null)
                            <span> — Qty: {{ $qtyLines[$i] }}</span>
                        @endif
                    </li>
                @endforeach
            </ul>
        @else
            <p style="margin:6px 0 0;">—</p>
        @endif
    </div>

    <div class="info-section">
        <h2>Issued Items</h2>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                @php
                    $row = is_array($item) ? $item : $item->toArray();
                    $qty = $row['issued_quantity'] ?? null;
                @endphp
                <tr>
                    <td>{{ $row['barcode'] ?? '' }}</td>
                    <td>{{ $row['product_name'] ?? '' }}</td>
                    <td>{{ $qty !== null ? $qty : '—' }}</td>
                    <td>{{ $qty !== null ? 'Break pieces issued' : '(Issued)' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <table class="signature-table">
        <tr>
            <td>
                <div class="signature-line">Requester Signature</div>
            </td>
            <td style="width:10%;"></td>
            <td>
                <div class="signature-line">Admin/Issuer Signature</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>This receipt serves as proof of item issuance. Please keep this document for your records.</p>
        <p>Generated by Inventory Management System</p>
    </div>
</body>
</html>
