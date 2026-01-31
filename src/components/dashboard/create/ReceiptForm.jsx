"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createReceipt } from "@/app/actions/receipts/create-receipt";
import { PdfUpload } from "./PdfUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [verificationStatus, setVerificationStatus] = useState({});

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

  const premium = watch("premium");
  const vat = watch("vat");

  useEffect(() => {
    if (premium && vat) {
      const premiumNum = parseFloat(premium.replace(/,/g, "")) || 0;
      const vatNum = parseFloat(vat.replace(/,/g, "")) || 0;
      const totalNum = premiumNum + vatNum;
      setValue("total", totalNum.toFixed(2));
    }
  }, [premium, vat, setValue]);

  const handleAutoFill = (extractedData, status) => {
    setVerificationStatus(status || {});
    Object.keys(extractedData).forEach((key) => {
      if (extractedData[key] !== null && extractedData[key] !== undefined) {
        setValue(key, String(extractedData[key]));
      }
    });
  };

  // Helper to render verification icons
  const renderIcon = (fieldName) => {
    const status = verificationStatus[fieldName];
    if (status === "verified") {
      return (
        <ShieldCheck className="absolute right-3 top-2.5 text-green-500 size-4 pointer-events-none" />
      );
    }
    if (status === "mismatch") {
      return (
        <div className="absolute right-3 top-2.5 group cursor-help z-10">
          <AlertTriangle className="text-red-500 size-4" />
          <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-48 p-2 bg-destructive text-destructive-foreground text-xs rounded shadow-lg">
            ⚠️ Value mismatch with PDF! Please verify manually.
          </div>
        </div>
      );
    }
    return null;
  };

  const onSubmit = async (data) => {
    startTransition(async () => {
      try {
        const result = await createReceipt(data);
        if (result.success) {
          toast.success(`Receipt Created! No: ${result.data.receiptNo}`);
          router.push("/receipts");
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-6">Receipt Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="issuingOffice">Issuing Office</Label>
                <div className="relative">
                  <Input
                    id="issuingOffice"
                    {...register("issuingOffice")}
                    readOnly
                    className="bg-muted pr-10"
                  />
                  {renderIcon("issuingOffice")}
                </div>
                {errors.issuingOffice && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.issuingOffice.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label htmlFor="receiptNo">Receipt No</Label>
                <div className="relative">
                  <Input
                    id="receiptNo"
                    {...register("receiptNo")}
                    className="pr-10"
                  />
                  {renderIcon("receiptNo")}
                </div>
                {errors.receiptNo && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.receiptNo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="classOfInsurance">Class of Insurance</Label>
                <div className="relative">
                  <Input
                    id="classOfInsurance"
                    {...register("classOfInsurance")}
                    className="pr-10"
                  />
                  {renderIcon("classOfInsurance")}
                </div>
                {errors.classOfInsurance && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.classOfInsurance.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    {...register("date")}
                    type="date"
                    className="pr-10"
                  />
                  {renderIcon("date")}
                </div>
                {errors.date && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Received From */}
            <div className="relative">
              <Label htmlFor="receivedFrom">Received From</Label>
              <div className="relative">
                <Textarea
                  id="receivedFrom"
                  {...register("receivedFrom")}
                  rows={4}
                  className="resize-none pr-10"
                />
                {renderIcon("receivedFrom")}
              </div>
              {errors.receivedFrom && (
                <p className="text-destructive text-xs mt-1">
                  {errors.receivedFrom.message}
                </p>
              )}
            </div>

            {/* Sum of (Full Width) */}
            <div className="relative">
              <Label htmlFor="sumOf">The Sum of (BDT)</Label>
              <div className="relative">
                <Textarea
                  id="sumOf"
                  {...register("sumOf")}
                  rows={2}
                  className="resize-none pr-10"
                  placeholder="e.g. 1,02,695.00 (One Lakh...)"
                />
                {renderIcon("sumOf")}
              </div>
              {errors.sumOf && (
                <p className="text-destructive text-xs mt-1">
                  {errors.sumOf.message}
                </p>
              )}
            </div>

            {/* Payment & Drawn On */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="modeOfPayment">Mode of Payment</Label>
                <div className="relative">
                  <Input
                    id="modeOfPayment"
                    {...register("modeOfPayment")}
                    className="pr-10"
                  />
                  {renderIcon("modeOfPayment")}
                </div>
                {errors.modeOfPayment && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.modeOfPayment.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label htmlFor="drawnOn">Drawn On (Optional)</Label>
                <div className="relative">
                  <Input
                    id="drawnOn"
                    {...register("drawnOn")}
                    className="pr-10"
                  />
                  {renderIcon("drawnOn")}
                </div>
              </div>
            </div>

            {/* Issued Against & Cheque Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="issuedAgainst">Issued Against (Optional)</Label>
                <div className="relative">
                  <Input
                    id="issuedAgainst"
                    {...register("issuedAgainst")}
                    className="pr-10"
                  />
                  {renderIcon("issuedAgainst")}
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="chequeDate">Cheque Date (Optional)</Label>
                <div className="relative">
                  <Input
                    id="chequeDate"
                    {...register("chequeDate")}
                    type="date"
                    className="pr-10"
                  />
                  {renderIcon("chequeDate")}
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold mb-4">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative">
                  <Label htmlFor="premium">Premium</Label>
                  <div className="relative">
                    <Input
                      id="premium"
                      {...register("premium")}
                      type="number"
                      step="0.01"
                      className="pr-10"
                    />
                    {renderIcon("premium")}
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="vat">VAT</Label>
                  <div className="relative">
                    <Input
                      id="vat"
                      {...register("vat")}
                      type="number"
                      step="0.01"
                      className="pr-10"
                    />
                    {renderIcon("vat")}
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="total">Total</Label>
                  <div className="relative">
                    <Input
                      id="total"
                      {...register("total")}
                      type="number"
                      step="0.01"
                      readOnly
                      className="bg-muted pr-10"
                    />
                    {renderIcon("total")}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                size="lg"
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Generate Receipt
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
        <PdfUpload onDataExtracted={handleAutoFill} />
      </div>
    </div>
  );
}
