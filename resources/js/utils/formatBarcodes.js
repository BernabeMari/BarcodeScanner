/**
 * Display barcodes whether stored as a string (legacy) or string[].
 */
export function formatBarcodes(value) {
    if (value == null || value === "") {
        return "—";
    }
    if (Array.isArray(value)) {
        return value.filter((x) => x != null && String(x).trim() !== "").join(", ");
    }
    return String(value);
}
