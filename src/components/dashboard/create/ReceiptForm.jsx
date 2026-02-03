"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createReceipt } from "@/app/actions/receipts/create-receipt";
import { updateReceipt } from "@/app/actions/receipts/update-receipt";
import { PdfUpload } from "./PdfUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const receiptSchema = z.object({
  companyType: z.enum(["GLOBAL", "FEDERAL", "TAKAFUL"], {
    required_error: "Please select a company",
  }),
  issuingOffice: z.string().optional(),
  bin: z.string().min(1, "BIN is required"),
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
  stamp: z.string().optional(),
  total: z.string().min(1, "Total is required"),
  clientName: z.string().optional(),
});

export default function ReceiptForm({ initialData = null, receiptId = null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [verificationStatus, setVerificationStatus] = useState({});

  const isEditMode = !!receiptId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      companyType: initialData?.companyType || "GLOBAL",
      issuingOffice: initialData?.issuingOffice || "Rangpur Branch",
      bin: initialData?.bin || "",
      receiptNo: initialData?.receiptNo || "",
      classOfInsurance: initialData?.classOfInsurance || "",
      date: initialData?.date || "",
      receivedFrom: initialData?.receivedFrom || "",
      sumOf: initialData?.sumOf || "",
      modeOfPayment: initialData?.modeOfPayment || "",
      drawnOn: initialData?.drawnOn || "",
      issuedAgainst: initialData?.issuedAgainst || "",
      chequeDate: initialData?.chequeDate || "",
      premium: initialData?.premium || "",
      vat: initialData?.vat || "",
      stamp: initialData?.stamp || "",
      total: initialData?.total || "",
      clientName: initialData?.clientName || "",
    },
  });

  const premium = watch("premium");
  const vat = watch("vat");
  const stamp = watch("stamp");

  useEffect(() => {
    if (premium && vat) {
      const premiumNum = parseFloat(premium.replace(/,/g, "")) || 0;
      const vatNum = parseFloat(vat.replace(/,/g, "")) || 0;
      const stampNum = parseFloat(stamp?.replace(/,/g, "") || "0") || 0;
      const totalNum = premiumNum + vatNum + stampNum;
      setValue("total", totalNum.toFixed(2));
    }
  }, [premium, vat, stamp, setValue]);

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
        let result;

        if (isEditMode) {
          result = await updateReceipt(receiptId, data);
        } else {
          result = await createReceipt(data);
        }

        if (result.success) {
          toast.success(
            isEditMode
              ? `Receipt Updated! No: ${result.data.receiptNo}`
              : `Receipt Created! No: ${result.data.receiptNo}`,
          );
          router.push("/receipts");
          router.refresh();
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Company Selector Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
              <h2 className="text-lg font-semibold">Receipt Details</h2>

              {/* COMPANY SELECTION DROPDOWN */}
              <div className="w-full md:w-1/2">
                <Label
                  htmlFor="companyType"
                  className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground"
                >
                  Select Company Template
                </Label>
                <Select
                  value={watch("companyType")}
                  onValueChange={(value) => setValue("companyType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-100">
                    <SelectItem value="GLOBAL">
                      Global Insurance Ltd.
                    </SelectItem>
                    <SelectItem value="FEDERAL">
                      Federal Insurance Company Ltd.
                    </SelectItem>
                    <SelectItem value="TAKAFUL">
                      Takaful Islami Insurance Ltd.
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.companyType && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.companyType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Label htmlFor="bin">BIN</Label>
                <div className="relative">
                  <Input
                    id="bin"
                    {...register("bin")}
                    className="pr-10"
                    placeholder="e.g. 000001297-0202"
                  />
                  {renderIcon("bin")}
                </div>
                {errors.bin && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.bin.message}
                  </p>
                )}
                {/* Hidden Static Field for DB Compatibility */}
                <input type="hidden" {...register("issuingOffice")} />
                {/* Hidden Field for Client Name */}
                <input type="hidden" {...register("clientName")} />
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
                <Label htmlFor="date">Date (DD-MM-YYYY)</Label>
                <div className="relative">
                  <Input
                    id="date"
                    {...register("date")}
                    type="text"
                    placeholder="dd-mm-yyyy"
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
                <Label htmlFor="chequeDate">Cheque Date (DD-MM-YYYY)</Label>
                <div className="relative">
                  <Input
                    id="chequeDate"
                    {...register("chequeDate")}
                    type="text"
                    placeholder="dd-mm-yyyy"
                    className="pr-10"
                  />
                  {renderIcon("chequeDate")}
                </div>
              </div>
            </div>

            {/* Financial */}
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

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative">
                  <Label htmlFor="stamp">Stamp (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="stamp"
                      {...register("stamp")}
                      type="number"
                      step="0.01"
                      className="pr-10"
                    />
                    {renderIcon("stamp")}
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
