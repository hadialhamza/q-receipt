"use client";

import Image from "next/image";
import DownloadPDFButton from "../DownloadPDFButton";

export default function FederalTemplate({ data, code }) {
  return (
    <div className="max-w-200 mx-auto text-black">
      <div className="bg-white px-[10.5px]">
        {/* Header Image */}
        <div className="text-center pt-3.5">
          <Image
            src="/federal/header.png"
            alt="Federal Insurance PLC"
            width={800}
            height={100}
            className="w-full h-auto"
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>

        {/* Address */}
        <div className="text-center text-sm text-black whitespace-pre-line leading-5.25">
          {`Head Office: Navana D.H. Tower (6th Floor), 6, Panthapath, Dhaka-1215, Bangladesh. 
Phone: 02223374054-55, 02223374056, 02223374057, 02223374058  
Fax: 02223374062 Email: headoffice@federalinsubd.com Web: www.federalinsubd.com`}
        </div>

        {/* BIN and Download */}
        <div className="flex justify-between mt-5 px-3 text-black">
          <div className="inline-block">
            <label htmlFor="BIN">BIN : 000251825-0203</label>
          </div>
          <div className="inline-block text-right print:hidden">
            <DownloadPDFButton shortCode={code || data.shortCode} data={data} />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="pr-3 text-black">
          {/* Title */}
          <div className="mt-1 text-center">
            <label>MONEY RECEIPT</label>
            <p className="text-[11px] text-black">MUSHAK : 6.3</p>
          </div>

          {/* Receipt Details */}
          <div className="py-4">
            <div className="grid grid-cols-2">
              {/* Left Column */}
              <div>
                <div className="flex m-0">
                  <div className="basis-5/12">Issuing Office</div>
                  <div className="basis-7/12">
                    <div className="float-left pr-1.25">:</div>
                    <div className="float-left">
                      {data.issuingOffice || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="basis-5/12">Money Receipt No.</div>
                  <div className="basis-7/12">
                    <div className="float-left pr-1.25">:</div>
                    <div className="float-left">{data.receiptNo || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex pr-0">
              {/* Class of Insurance */}
              <div className="basis-1/2">
                <div className="flex m-0">
                  <div className="basis-5/12">Class of Insurance</div>
                  <div className="basis-7/12">
                    <div className="float-left pl-0.75 pr-1.25">:</div>
                    <div className="float-left">
                      {data.classOfInsurance || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="basis-1/2 text-right pr-0">
                Date : {data.date || "N/A"}
              </div>
            </div>
          </div>

          {/* Received with thanks from */}
          <div className="flex items-end my-2">
            <div className="basis-1/3">
              <span className="font-medium">Received with thanks from</span>
            </div>
            <div className="basis-2/3 border-b border-[#333] pl-0">
              <span>{data.receivedFrom || ""}</span>
            </div>
          </div>

          {/* The sum of */}
          <div className="flex items-end mb-2">
            <div className="basis-1/6">
              <span>The sum of</span>
            </div>
            <div className="basis-5/6 border-b border-[#333]">
              {data.sumOf || ""}
            </div>
          </div>

          {/* Mode of Payment + Dated */}
          <div className="flex items-end mb-2">
            <div className="basis-1/4">
              <span>Mode of Payment</span>
            </div>
            <div className="basis-1/3 border-b border-[#333]">
              {data.modeOfPayment || ""}
            </div>
            <div className="basis-1/6 text-right">
              <span>Dated</span>
            </div>
            <div className="basis-1/4 border-b border-[#333]">
              {data.chequeDate || ""}
            </div>
          </div>

          {/* Drawn on */}
          <div className="flex items-end mb-2">
            <div className="basis-1/6">
              <span>Drawn on</span>
            </div>
            <div className="basis-5/6 border-b border-[#333]">
              {data.drawnOn || ""}
            </div>
          </div>

          {/* Issued against */}
          <div className="flex items-end mb-2">
            <div className="basis-1/6">
              <span>Issued against</span>
            </div>
            <div className="basis-5/6 border-b border-[#333]">
              {data.issuedAgainst || ""}
            </div>
          </div>

          {/* Payment Table */}
          <div className="flex">
            <div className="basis-1/2 mt-4">
              <table className="w-full text-black">
                <tbody>
                  <tr className="border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] w-[40%] pl-2">
                      Premium
                    </td>
                    <td className="p-[3px_9px] border border-[#333] w-[15%] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-2">
                      {parseFloat(data.premium || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] pl-2">
                      Vat
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-2">
                      {parseFloat(data.vat || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="bg-[lightgray] border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] pl-2">
                      Total
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-2">
                      {parseFloat(data.total || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Computer generated notice */}
          <div className="mt-4">
            <div className="text-center font-medium text-[#808080] text-sm">
              This RECEIPT is computer generated, authorized signature is not
              required.
            </div>
          </div>

          {/* Gray background notice */}
          <div className="-ml-px -mr-3.25">
            <div className="text-center bg-[lightgray] p-1.25 text-black">
              Receipt valid subject to encashment of cheque/P.O./D.D.
            </div>
          </div>

          {/* Red warning */}
          <div className="pb-2">
            <label className="text-[#ff0000]">
              * Note: If have any complain about Insurance, call 16130.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
