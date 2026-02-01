import { cn } from "@/lib/utils";

export function CustomStatsCard({ title, value, className, colorString }) {
    // Exact hex colors matching the reference design for solid pastel look
    const colorConfigs = {
        purple: { bg: "#C4B5FD", valueColor: "#6D28D9", circle: "#A78BFA" }, // Violet-300 bg, Violet-700 text
        orange: { bg: "#FFDBB9", valueColor: "#C2410C", circle: "#FFCC99" }, // Orange-200ish
        green: { bg: "#BCF0DA", valueColor: "#046C4E", circle: "#98E5C5" }, // Emerald-200ish
        blue: { bg: "#BDEFFD", valueColor: "#0369A1", circle: "#98DFFC" }, // Sky-200ish
    };

    // Fallback
    const config = colorConfigs[colorString] || { bg: "#ffffff", valueColor: "#000000", circle: "#f3f4f6" };

    return (
        <div
            className={cn("relative overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-md h-[140px]", className)}
            style={{ backgroundColor: config.bg }}
        >
            <div className="p-6 h-full flex flex-col justify-between">
                <div className="relative z-10">
                    {/* Title is Dark Gray/Black as per design */}
                    <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase opacity-80">{title}</h3>

                    {/* Value is Colored (Darker shade of background) */}
                    <h2
                        className="text-4xl font-bold mt-2 tracking-tight"
                        style={{ color: config.valueColor }}
                    >
                        {value}
                    </h2>
                </div>

                {/* Decorative Circular Shapes */}
                <div
                    className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-40 pointer-events-none"
                    style={{ backgroundColor: config.circle }}
                />
            </div>
        </div>
    );
}
