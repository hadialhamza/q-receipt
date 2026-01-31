import Link from "next/link";

export default function NotFoundReceipt() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-8 rounded-lg border bg-card text-center">
                <div className="mb-6">
                    <svg
                        className="w-20 h-20 mx-auto text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <h1 className="font-heading text-2xl font-bold mb-2">
                    Receipt Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                    The receipt you're looking for doesn't exist or has been removed.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
