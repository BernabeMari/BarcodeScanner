export default function UserAvatar({ user, className = "h-12 w-12", alt = "" }) {
    const pic = user?.profile_picture != null ? String(user.profile_picture).trim() : ""
    const src = pic !== "" ? `/storage/${pic}` : null
    const initials = String(user?.username ?? "?")
        .slice(0, 2)
        .toUpperCase()

    if (src) {
        return (
            <img
                src={src}
                alt={alt || user?.username || "User"}
                className={`rounded-full object-cover ring-2 ring-slate-200 ${className}`}
            />
        )
    }

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-xs font-bold text-white ring-2 ring-slate-200 sm:text-sm ${className}`}
            aria-hidden
        >
            {initials}
        </div>
    )
}
