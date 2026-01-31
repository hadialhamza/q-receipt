"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createReceipt } from "@/app/actions/receipts/create-receipt";
import { PdfUpload } from "./PdfUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Validation schema
const receiptSchema = z.object({
    issuingOffice: z.string().min(1, "Issuing office is required"),
    receiptNo: z.string().min(1, "Receipt number is required"),
    classOfInsurance: z.string().min(1, "Class of insurance is required"),
    date: z.string().min(1, "Date is required"),
    receivedFrom: z.string().min(1, "Received from is required"),
    sumOf: z.string().min(1, "Sum is required"),
    modeOfPayment: z.string().min(1, "Mode of payment is required"),
    drawnOn: z.string().optional(),
    issuedAgainst: z.string().optional(),
    chequeDate: z.string().optional(),
    premium: z.string().min(1, "Premium is required"),
    vat: z.string().min(1, "VAT is required"),
    total: z.string().min(1, "Total is required"),
});

export default function ReceiptForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            issuingOffice: "Rangpur Branch",
            receiptNo: "",
            classOfInsurance: "",
            date: new Date().toISOString().split("T")[0],
            receivedFrom: "",
            sumOf: "",
            modeOfPayment: "",
            drawnOn: "",
            issuedAgainst: "",
            chequeDate: "",
            premium: "",
            vat: "",
            total: "",
        },
    });

    // Watch premium and vat for auto-calculation
    const premium = watch("premium");
    const vat = watch("vat");

    // Auto-calculate total when premium or vat changes
    useEffect(() => {
        if (premium && vat) {
            const premiumNum = parseFloat(premium.replace(/,/g, "")) || 0;
            const vatNum = parseFloat(vat.replace(/,/g, "")) || 0;
            const totalNum = premiumNum + vatNum;
            setValue("total", totalNum.toFixed(2));
        }
    }, [premium, vat, setValue]);

    // Handle PDF auto-fill
    const handleAutoFill = (extractedData) => {
        Object.keys(extractedData).forEach((key) => {
            if (extractedData[key]) {
                setValue(key, extractedData[key]);
            }
        });
    };

    // Form submission
    const onSubmit = async (data) => {
        console.log("=== FORM DATA ===");
        console.log(data);
        console.log("================");

        startTransition(async () => {
            try {
                const result = await createReceipt(data);

                if (result.success) {
                    toast.success(`Receipt Created! Receipt No: ${result.data.receiptNo}`);
                    router.push("/receipts");
                } else {
                    toast.error(result.error || "Failed to create receipt");
                }
            } catch (error) {
                console.error("Submit error:", error);
                toast.error("Something went wrong!");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">Create Receipt</h1>
                <p className="text-muted-foreground">
                    Generate a new insurance receipt
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-6">Receipt Details</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Row 1: Issuing Office & Receipt No */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="issuingOffice">Issuing Office</Label>
                                    <Input
                                        id="issuingOffice"
                                        {...register("issuingOffice")}
                                        placeholder="e.g. Rangpur Branch"
                                        readOnly
                                        className="bg-muted"
                                    />
                                    {errors.issuingOffice && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.issuingOffice.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="receiptNo">Receipt No</Label>
                                    <Input
                                        id="receiptNo"
                                        {...register("receiptNo")}
                                        placeholder="e.g. RNP-2025-000363"
                                    />
                                    {errors.receiptNo && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.receiptNo.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Class of Insurance & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="classOfInsurance">Class of Insurance</Label>
                                    <Input
                                        id="classOfInsurance"
                                        {...register("classOfInsurance")}
                                        placeholder="e.g. Fire"
                                    />
                                    {errors.classOfInsurance && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.classOfInsurance.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" {...register("date")} type="date" />
                                    {errors.date && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.date.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Received From (Textarea) */}
                            <div>
                                <Label htmlFor="receivedFrom">Received From</Label>
                                <Textarea
                                    id="receivedFrom"
                                    {...register("receivedFrom")}
                                    placeholder="Enter full details (Name, Address, Property, etc.)"
                                    rows={4}
                                    className="resize-none"
                                />
                                {errors.receivedFrom && (
                                    <p className="text-destructive text-xs mt-1">
                                        {errors.receivedFrom.message}
                                    </p>
                                )}
                            </div>

                            {/* Row 3: Sum of & Mode of Payment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="sumOf">The Sum of (BDT)</Label>
                                    <Input
                                        id="sumOf"
                                        {...register("sumOf")}
                                        placeholder="e.g. 1,02,695.00"
                                    />
                                    {errors.sumOf && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.sumOf.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="modeOfPayment">Mode of Payment</Label>
                                    <Input
                                        id="modeOfPayment"
                                        {...register("modeOfPayment")}
                                        placeholder="e.g. Cheque; 2530860"
                                    />
                                    {errors.modeOfPayment && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.modeOfPayment.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Drawn On & Issued Against */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="drawnOn">Drawn On (Optional)</Label>
                                    <Input
                                        id="drawnOn"
                                        {...register("drawnOn")}
                                        placeholder="e.g. Mercantile Bank PLC"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="issuedAgainst">Issued Against (Optional)</Label>
                                    <Input
                                        id="issuedAgainst"
                                        {...register("issuedAgainst")}
                                        placeholder="e.g. GIL/RNP/FC-00194/12/2025"
                                    />
                                </div>
                            </div>

                            {/* Row 5: Cheque Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="chequeDate">Cheque Date (Optional)</Label>
                                    <Input id="chequeDate" {...register("chequeDate")} type="date" />
                                </div>
                            </div>

                            {/* Financial Section */}
                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-semibold mb-4">Financial Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <Label htmlFor="premium">Premium (BDT)</Label>
                                        <Input
                                            id="premium"
                                            {...register("premium")}
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g. 89300.00"
                                        />
                                        {errors.premium && (
                                            <p className="text-destructive text-xs mt-1">
                                                {errors.premium.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="vat">VAT (BDT)</Label>
                                        <Input
                                            id="vat"
                                            {...register("vat")}
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g. 13395.00"
                                        />
                                        {errors.vat && (
                                            <p className="text-destructive text-xs mt-1">
                                                {errors.vat.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="total">Total (Auto-Calculated)</Label>
                                        <Input
                                            id="total"
                                            {...register("total")}
                                            type="number"
                                            step="0.01"
                                            placeholder="Auto-calculated"
                                            readOnly
                                            className="bg-muted"
                                        />
                                        {errors.total && (
                                            <p className="text-destructive text-xs mt-1">
                                                {errors.total.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 size-4" />
                                            Generate Receipt
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <PdfUpload onDataExtracted={handleAutoFill} />
                </div>
            </div>
        </div>
    );
}
