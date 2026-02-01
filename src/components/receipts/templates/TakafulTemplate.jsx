"use client";

import Image from "next/image";
import DownloadPDFButton from "../DownloadPDFButton";

export default function TakafulTemplate({ data, code }) {
  return (
    <div className="max-w-200 mx-auto text-black">
      <div className="bg-white px-[10.5px]">
        {/* Header Image */}
        <div className="text-center pt-3.5">
          <Image
            src="/takaful/takaful.webp"
            alt="Takaful Islami Insurance Limited"
            width={800}
            height={100}
            className="w-full h-auto"
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>

        {/* Address */}
        <div className="text-center text-sm text-black whitespace-pre-line leading-5.25 mt-2">
          {`Head Office: Monir Tower (7th, 8th & 9th Floor), 167/1, D.I.T. Extension Road, Motijheel (Fakirapool), 
            Dhaka. Bangladesh Phone: 88-02-41070071-3 Fax: 880-2-41070083
            email: takaful@dhaka.net web: www.takaful.com.bd`}
        </div>

        {/* BIN and Download */}
        <div className="flex justify-between mt-10.5 text-black">
          <div className="inline-block">
            <label htmlFor="BIN">BIN : 000251825-0203</label>
          </div>
          <div className="inline-block text-right print:hidden">
            <DownloadPDFButton shortCode={code || data.shortCode} data={data} />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="text-black">
          {/* Title */}
          <div className="mt-[3.5px] text-center mb-3.5 pr-3.5">
            <label>MONEY RECEIPT</label>
            <p className="text-[11px] text-black">MUSHAK : 6.3</p>
          </div>

          {/* Receipt Details */}
          <div className="py-5.25 pr-3.5">
            <div className="grid grid-cols-2">
              {/* Left Column */}
              <div>
                <div className="flex m-0">
                  <div className="basis-5/12">Issuing Office</div>
                  <div className="basis-7/12">
                    <div className="float-left pl-1">:</div>
                    <div className="float-left pl-1.25">
                      {data.issuingOffice || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="basis-5/12">Money Receipt No.</div>
                  <div className="basis-7/12">
                    <div className="float-left pl-1">:</div>
                    <div className="float-left pl-1.25">
                      {data.receiptNo || "N/A"}
                    </div>
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
                    <div className="float-left pl-1">:</div>
                    <div className="float-left pl-1.25">
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
          <div className="flex items-end justify-between my-1.75 pr-1">
            <div className="basis-[30%]">
              <span className="font-bold">Received with thanks from</span>
            </div>
            <div className="basis-[67.5%] border-b border-[#333] pr-[10.5px]">
              <span>{data.receivedFrom || ""}</span>
            </div>
          </div>

          {/* The sum of */}
          <div className="flex items-end justify-between mb-1.75 pr-1">
            <div className="basis-[15%]">
              <span>The sum of</span>
            </div>
            <div className="basis-[84.5%] border-b border-[#333]">
              {data.sumOf || ""}
            </div>
          </div>

          {/* Mode of Payment + Dated */}
          <div className="flex items-end mb-1.75 pr-1">
            <div className="basis-[24%]">
              <span>Mode of Payment</span>
            </div>
            <div className="basis-[33.8%] border-b border-[#333]">
              {data.modeOfPayment || ""}
            </div>
            <div className="basis-[17%] text-right pr-[10.5px]">
              <span>Dated</span>
            </div>
            <div className="basis-[25.2%] border-b border-[#333]">
              {data.chequeDate || ""}
            </div>
          </div>

          {/* Drawn on */}
          <div className="flex items-end justify-between mb-1.75 pr-1">
            <div className="basis-[15%]">
              <span>Drawn on</span>
            </div>
            <div className="basis-[84.5%] border-b border-[#333]">
              {data.drawnOn || ""}
            </div>
          </div>

          {/* Issued against */}
          <div className="flex items-end justify-between mb-1.75 pr-1">
            <div className="basis-[15%]">
              <span>Issued against</span>
            </div>
            <div className="basis-[84.5%] border-b border-[#333]">
              {data.issuedAgainst || ""}
            </div>
          </div>

          {/* Payment Table */}
          <div className="flex">
            <div className="basis-1/2 mt-5.25 pr-4.25">
              <table className="w-full text-black">
                <tbody>
                  <tr className="border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] w-[40%] pl-1.75">
                      Premium
                    </td>
                    <td className="p-[3px_9px] border border-[#333] w-[15%] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-1.75">
                      {parseFloat(data.premium || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] pl-1.75">
                      Vat
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-1.75">
                      {parseFloat(data.vat || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr className="bg-[lightgray] border border-[#333]">
                    <td className="p-[3px_9px] border border-[#333] pl-1.75">
                      Total
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-center">
                      BDT
                    </td>
                    <td className="p-[3px_9px] border border-[#333] text-right pr-1.75">
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
          <div className="mt-5.25 pr-3.5">
            <div className="text-center font-medium text-[#808080] text-[13px]">
              This RECEIPT is computer generated, authorized signature is not
              required.
            </div>
          </div>

          {/* Gray background notice */}
          <div className="">
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
