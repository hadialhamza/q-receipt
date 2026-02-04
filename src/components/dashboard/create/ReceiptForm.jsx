"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { createReceipt } from "@/app/actions/receipts/create-receipt";
import { updateReceipt } from "@/app/actions/receipts/update-receipt";
import { PdfUpload } from "./PdfUpload";
import SavingLoader from "@/app/(dashboard)/create/savingLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sections
import CompanySection from "./_sections/CompanySection";
import IdentificationSection from "./_sections/IdentificationSection";
import InsuranceSection from "./_sections/InsuranceSection";
import ClientSection from "./_sections/ClientSection";
import PaymentSection from "./_sections/PaymentSection";
import FinancialSection from "./_sections/FinancialSection";

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

  const methods = useForm({
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

  const { handleSubmit, setValue } = methods;

  const [premium, vat, stamp] = useWatch({
    control: methods.control,
    name: ["premium", "vat", "stamp"],
  });

  useEffect(() => {
    if (premium && vat) {
      const premiumNum = parseFloat(String(premium).replace(/,/g, "")) || 0;
      const vatNum = parseFloat(String(vat).replace(/,/g, "")) || 0;
      const stampNum = parseFloat(String(stamp || "0").replace(/,/g, "")) || 0;
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
    <FormProvider {...methods}>
      {isPending && <SavingLoader />}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        <div className="lg:col-span-7">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2">
                  <FileText className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    Receipt Details
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    Fill in the form to generate receipt
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <CompanySection />

                <div className="space-y-5">
                  <IdentificationSection
                    verificationStatus={verificationStatus}
                  />
                  <InsuranceSection verificationStatus={verificationStatus} />
                  <ClientSection verificationStatus={verificationStatus} />
                  <PaymentSection verificationStatus={verificationStatus} />
                  <FinancialSection verificationStatus={verificationStatus} />
                </div>

                {/* Floating Submit Button */}
                <div className="sticky bottom-6 z-50 flex justify-center pt-4">
                  <div className="shadow-2xl shadow-primary/20 rounded-full p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 transition-all hover:scale-105 active:scale-95 group">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="rounded-full px-10 h-12 font-bold text-base shadow-none text-white transition-all bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <Save className="mr-2 size-5 group-hover:animate-bounce" />
                      {isEditMode ? "Update Receipt" : "Generate Receipt"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5 sticky top-22 self-start">
          <PdfUpload onDataExtracted={handleAutoFill} />
        </div>
      </div>
    </FormProvider>
  );
}
