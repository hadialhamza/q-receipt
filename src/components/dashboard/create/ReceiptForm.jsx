"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  ShieldCheck,
  AlertTriangle,
  Building2,
  FileText,
  CreditCard,
  Calendar,
  Hash,
  Banknote,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createReceipt } from "@/app/actions/receipts/create-receipt";
import { updateReceipt } from "@/app/actions/receipts/update-receipt";
import { PdfUpload } from "./PdfUpload";
import SavingLoader from "@/app/(dashboard)/create/savingLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    control,
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

  const [premium, vat, stamp, companyType] = useWatch({
    control,
    name: ["premium", "vat", "stamp", "companyType"],
  });

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
    <>
      {isPending && <SavingLoader />}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <FileText className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    Receipt Details
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    Company & Identification
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Company Selector Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* COMPANY SELECTION DROPDOWN */}
                  <div className="w-full md:w-1/2">
                    <Label
                      htmlFor="companyType"
                      className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Select Company Template
                    </Label>
                    <Select
                      value={companyType}
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
                    <Label
                      htmlFor="bin"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      BIN
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 text-indigo-500 size-4 pointer-events-none" />
                      <Input
                        id="bin"
                        {...register("bin")}
                        className="pl-9 pr-10"
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
                    <Label
                      htmlFor="receiptNo"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Receipt No
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 text-blue-500 size-4 pointer-events-none" />
                      <Input
                        id="receiptNo"
                        {...register("receiptNo")}
                        className="pl-9 pr-10"
                        placeholder="e.g. GIC/RGP/MV/23/001"
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
                    <Label
                      htmlFor="classOfInsurance"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Class of Insurance
                    </Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-2.5 text-emerald-500 size-4 pointer-events-none" />
                      <Input
                        id="classOfInsurance"
                        {...register("classOfInsurance")}
                        className="pl-9 pr-10"
                        placeholder="e.g. Comprehensive Motor Insurance"
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
                    <Label
                      htmlFor="date"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Date (DD-MM-YYYY)
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 text-orange-500 size-4 pointer-events-none" />
                      <Input
                        id="date"
                        {...register("date")}
                        type="text"
                        placeholder="dd-mm-yyyy"
                        className="pl-9 pr-10"
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
                  <Label
                    htmlFor="receivedFrom"
                    className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                  >
                    Received From
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-violet-500 size-4 pointer-events-none" />
                    <Textarea
                      id="receivedFrom"
                      {...register("receivedFrom")}
                      rows={4}
                      className="resize-none pl-9 pr-10"
                      placeholder="e.g. Mr. Rahim, House #10, Road #5..."
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
                  <Label
                    htmlFor="sumOf"
                    className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                  >
                    The Sum of (BDT)
                  </Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3 text-green-600 size-4 pointer-events-none" />
                    <Textarea
                      id="sumOf"
                      {...register("sumOf")}
                      rows={2}
                      className="resize-none pl-9 pr-10"
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
                    <Label
                      htmlFor="modeOfPayment"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Mode of Payment
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 text-cyan-500 size-4 pointer-events-none" />
                      <Input
                        id="modeOfPayment"
                        {...register("modeOfPayment")}
                        className="pl-9 pr-10"
                        placeholder="e.g. Cash / Cheque No. 1234"
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
                    <Label
                      htmlFor="drawnOn"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Drawn On (Optional)
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 text-pink-500 size-4 pointer-events-none" />
                      <Input
                        id="drawnOn"
                        {...register("drawnOn")}
                        className="pl-9 pr-10"
                        placeholder="e.g. Dutch Bangla Bank, Dhaka Br."
                      />
                      {renderIcon("drawnOn")}
                    </div>
                  </div>
                </div>

                {/* Issued Against & Cheque Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <Label
                      htmlFor="issuedAgainst"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Issued Against (Optional)
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 text-indigo-500 size-4 pointer-events-none" />
                      <Input
                        id="issuedAgainst"
                        {...register("issuedAgainst")}
                        className="pl-9 pr-10"
                        placeholder="e.g. Policy Number / Cover Note"
                      />
                      {renderIcon("issuedAgainst")}
                    </div>
                  </div>
                  <div className="relative">
                    <Label
                      htmlFor="chequeDate"
                      className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                    >
                      Cheque Date (DD-MM-YYYY)
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 text-orange-500 size-4 pointer-events-none" />
                      <Input
                        id="chequeDate"
                        {...register("chequeDate")}
                        type="text"
                        placeholder="dd-mm-yyyy"
                        className="pl-9 pr-10"
                      />
                      {renderIcon("chequeDate")}
                    </div>
                  </div>
                </div>

                {/* Financial */}
                <div className="pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                      <Banknote className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Financial Details</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                        Amounts & Calculations
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="relative">
                      <Label
                        htmlFor="premium"
                        className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                      >
                        Premium
                      </Label>
                      <div className="relative">
                        <Banknote className="absolute left-3 top-2.5 text-emerald-600 size-4 pointer-events-none" />
                        <Input
                          id="premium"
                          {...register("premium")}
                          type="number"
                          step="0.01"
                          className="pl-9 pr-10"
                          placeholder="0.00"
                        />
                        {renderIcon("premium")}
                      </div>
                    </div>
                    <div className="relative">
                      <Label
                        htmlFor="vat"
                        className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                      >
                        VAT
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 text-rose-500 size-4 pointer-events-none" />
                        <Input
                          id="vat"
                          {...register("vat")}
                          type="number"
                          step="0.01"
                          className="pl-9 pr-10"
                          placeholder="0.00"
                        />
                        {renderIcon("vat")}
                      </div>
                    </div>
                    <div className="relative">
                      <Label
                        htmlFor="total"
                        className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                      >
                        Total
                      </Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-2.5 text-blue-600 size-4 pointer-events-none" />
                        <Input
                          id="total"
                          {...register("total")}
                          type="number"
                          step="0.01"
                          readOnly
                          className="bg-muted pl-9 pr-10 font-bold"
                          placeholder="0.00"
                        />
                        {renderIcon("total")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="relative">
                      <Label
                        htmlFor="stamp"
                        className="mb-2 block text-xs font-bold uppercase text-muted-foreground"
                      >
                        Stamp (Optional)
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-2.5 text-amber-500 size-4 pointer-events-none" />
                        <Input
                          id="stamp"
                          {...register("stamp")}
                          type="number"
                          step="0.01"
                          className="pl-9 pr-10"
                          placeholder="0.00"
                        />
                        {renderIcon("stamp")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Submit Button - Sticky Position */}
                <div className="sticky bottom-6 z-50 flex justify-center pointer-events-none">
                  <div className="pointer-events-auto shadow-2xl shadow-primary/20 rounded-full p-1.5 bg-background/80 backdrop-blur-xl border border-border/50 transition-all hover:scale-105 active:scale-95">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="rounded-full px-8 h-12 font-bold text-base shadow-none text-white dark:text-white"
                      size="lg"
                      variant="default"
                    >
                      <Save className="mr-2 size-5" />
                      Generate Receipt
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <PdfUpload onDataExtracted={handleAutoFill} />
        </div>
      </div>
    </>
  );
}
