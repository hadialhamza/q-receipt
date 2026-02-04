import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function Loading() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <DashboardSkeleton />
        </div>
    );
}
