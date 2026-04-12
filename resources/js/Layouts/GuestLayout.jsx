import ApplicationLogo from "@/Components/ApplicationLogo"
import TcuPageBackground from "@/Components/TcuPageBackground"
import { Link } from "@inertiajs/react"

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <TcuPageBackground />
            <div className="relative z-10 flex flex-col items-center">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-white drop-shadow-md" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden rounded-lg border border-white/20 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-sm sm:max-w-md sm:rounded-xl">
                    {children}
                </div>
            </div>
        </div>
    )
}
