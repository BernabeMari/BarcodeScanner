import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function BarcodeScanner({ onScan }) {

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText); // send barcode to parent
                scanner.clear();
            },
            (error) => {
                console.log(error);
            }
        );

    }, []);

    return (
        <div>
            <div id="reader"></div>
        </div>
    );
}