/**
 * Convert a number to English words
 * Supports up to Crore (Bangladeshi numbering context)
 */

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertChunk(n) {
  if (n === 0) return "";

  if (n < 20) return ones[n];

  if (n < 100) {
    const t = tens[Math.floor(n / 10)];
    const o = ones[n % 10];
    return o ? `${t} ${o}` : t;
  }

  const h = ones[Math.floor(n / 100)];
  const remainder = n % 100;
  if (remainder === 0) return `${h} Hundred`;
  return `${h} Hundred ${convertChunk(remainder)}`;
}

export function numberToWords(num) {
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(Math.abs(num));

  // Use integer part only
  const n = Math.floor(Math.abs(num));

  if (n < 1000) return convertChunk(n);

  const parts = [];

  // Crore (1,00,00,000)
  const crore = Math.floor(n / 10000000);
  if (crore > 0) parts.push(`${convertChunk(crore)} Crore`);

  // Lakh (1,00,000)
  const lakh = Math.floor((n % 10000000) / 100000);
  if (lakh > 0) parts.push(`${convertChunk(lakh)} Lakh`);

  // Thousand
  const thousand = Math.floor((n % 100000) / 1000);
  if (thousand > 0) parts.push(`${convertChunk(thousand)} Thousand`);

  // Remainder (< 1000)
  const remainder = n % 1000;
  if (remainder > 0) parts.push(convertChunk(remainder));

  return parts.join(" ");
}

/**
 * Format amount with commas (Bangladeshi style: 29,760.00)
 */
export function formatAmount(num) {
  return Number(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Build sumOf string: "Tk. 29,760.00 (Twenty Nine Thousand Seven Hundred Sixty taka)"
 */
export function buildSumOf(total) {
  const num = parseFloat(String(total).replace(/,/g, "")) || 0;
  const formatted = formatAmount(num);
  const words = numberToWords(num);
  return `Tk. ${formatted} (${words} taka)`;
}
