export default function TcuPageBackground() {
    return (
        <>
            <div
                className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/TCU.jpg')" }}
                aria-hidden
            />
            <div className="pointer-events-none fixed inset-0 z-[1] bg-slate-950/55 backdrop-blur-[1px]" aria-hidden />
        </>
    )
}
