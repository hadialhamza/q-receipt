"use client";

export default function GlobalTemplate({ data }) {
    return (
        <div className="receipt-container container-fluid">
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Global Insurance Template</h1>
                <p className="text-muted-foreground">
                    This template is under development. Receipt #{data.receiptNo}
                </p>
            </div>
        </div>
    );
}
