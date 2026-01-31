import { deleteAllReceipts } from "@/app/actions/receipts/delete-all-receipts";
import { redirect } from "next/navigation";

export default async function CleanupPage() {
    const result = await deleteAllReceipts();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-8 rounded-lg border bg-card">
                <h1 className="text-2xl font-bold mb-4">Cleanup Receipts</h1>

                {result.success ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-green-600 dark:text-green-400 font-semibold">
                                ✅ Success
                            </p>
                            <p className="text-sm mt-2">
                                Deleted {result.deletedCount} test receipts
                            </p>
                        </div>
                        <a
                            href="/dashboard"
                            className="block text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-red-600 dark:text-red-400 font-semibold">
                            ❌ Error
                        </p>
                        <p className="text-sm mt-2">{result.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
