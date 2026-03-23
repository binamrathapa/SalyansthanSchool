import { FeeBillingResponse } from "../types/fee-billing";

interface PrintReceiptProps {
  data: FeeBillingResponse;
}

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  return convert(Math.floor(num));
}

const ReceiptContent = ({ data }: PrintReceiptProps) => {
  const latestPayment = data.payment_history[0];


  return (
    <div className="w-1/2 p-2">
      <div className="receipt-container border border-gray-300 h-full p-2 flex flex-col">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-3 mb-3 relative">
          {/* Logo */}
          <img
            src="/salyansthan-logo.png"
            alt="School Logo"
            className="absolute left-2 top-1 w-12 h-12 object-contain"
          />
          <p className="text-[11px] italic text-slate-600">“Dedicated to Excellence”</p>
          <h1 className="text-lg font-bold text-slate-900 leading-tight uppercase">
            SALYANSTHAN SECONDARY SCHOOL
          </h1>
          <p className="text-[11px] text-slate-600 leading-tight">
            Kirtipur-4, Salyansthan, Kathmandu
          </p>
          <p className="text-[11px] text-slate-600 leading-tight">
            Email: schoolsalyansthan@gmail.com
          </p>
          <p className="text-[11px] text-slate-600 leading-tight">
            Phone: 01-5904264
          </p>
          <h2 className="text-sm font-bold text-slate-800 mt-2 uppercase tracking-wide bg-slate-100 py-1">
            Payment Receipt
          </h2>
        </div>
        {/* Receipt Info */}
        <div className="flex justify-between mb-3 text-[11px]">
          <div>
            <p><span className="text-slate-600">Receipt No:</span> <span className="font-bold text-slate-800">{latestPayment?.receipt_no || "N/A"}</span></p>
            <p className="mt-0.5"><span className="text-slate-600">Date:</span> <span className="font-semibold">{latestPayment?.date || new Date().toLocaleDateString()}</span></p>
          </div>
          <div className="text-right">
            <p><span className="text-slate-600">Academic Year:</span> <span className="font-semibold">{data.academic_year}</span></p>
            <p className="mt-0.5"><span className="text-slate-600">Month:</span> <span className="font-semibold">{data.current_month}</span></p>
          </div>
        </div>

        {/* Student Info */}
        <div className="border border-slate-300 rounded p-2.5 mb-3">
          <h3 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wide">Student Details</h3>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p><span className="text-slate-600">Name:</span> <span className="font-semibold text-slate-800">{data.student.name}</span></p>
              <p className="mt-0.5"><span className="text-slate-600">Admission No:</span> <span className="font-semibold">{data.student.admission_no}</span></p>
            </div>
            <div>
              <p><span className="text-slate-600">Class &amp; Section:</span> <span className="font-semibold">{data.student.class} - {data.student.section}</span></p>
              <p className="mt-0.5"><span className="text-slate-600">Roll No:</span> <span className="font-semibold">{data.student.roll_no}</span></p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wide">Payment Details</h3>
          <table className="w-full text-[11px] border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left py-1 px-2 border-b border-slate-300">Description</th>
                <th className="text-right py-1 px-2 border-b border-slate-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 px-2 border-b border-slate-200">Monthly Fee ({data.current_month})</td>
                <td className="py-1 px-2 border-b border-slate-200 text-right">{money(data.fee_structure.base_amount)}</td>
              </tr>
              {data.discount.amount > 0 && (
                <tr>
                  <td className="py-1 px-2 border-b border-slate-200 text-green-700">Discount ({data.discount.type})</td>
                  <td className="py-1 px-2 border-b border-slate-200 text-right text-green-700">- {money(data.discount.amount)}</td>
                </tr>
              )}
              {data.previous_due.total_due > 0 && (
                <tr>
                  <td className="py-1 px-2 border-b border-slate-200 text-amber-700">Previous Due</td>
                  <td className="py-1 px-2 border-b border-slate-200 text-right text-amber-700">+ {money(data.previous_due.total_due)}</td>
                </tr>
              )}
              <tr className="bg-slate-50">
                <td className="py-1 px-2 border-b border-slate-300 font-semibold">Total Payable</td>
                <td className="py-1 px-2 border-b border-slate-300 text-right font-semibold">{money(data.current_month_payment.total_payable)}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-1.5 px-2 font-bold text-green-800">Amount Paid</td>
                <td className="py-1.5 px-2 text-right font-bold text-green-800 text-base">{money(latestPayment?.paid_amount || data.current_month_payment.paid_amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment & Balance Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-slate-300 rounded p-2.5">
            <h4 className="font-bold text-slate-800 mb-1 text-[11px]">Payment Information</h4>
            <div className="text-[11px] space-y-0.5">
              <p><span className="text-slate-600">Payment Method:</span> <span className="font-semibold">{latestPayment?.method || "Cash"}</span></p>
              <p><span className="text-slate-600">Payment Status:</span> <span className="font-semibold">{data.current_month_payment.status}</span></p>
              <p><span className="text-slate-600">Payment Date:</span> <span className="font-semibold">{latestPayment?.date || new Date().toLocaleDateString()}</span></p>
            </div>
          </div>

          <div className="border border-slate-300 rounded p-2.5">
            <h4 className="font-bold text-slate-800 mb-1 text-[11px]">Balance Information</h4>
            <div className="text-[11px] space-y-0.5">
              <p><span className="text-slate-600">Previous Balance:</span> <span className="font-semibold">{money(data.current_month_payment.total_payable)}</span></p>
              <p><span className="text-slate-600">Amount Paid:</span> <span className="font-semibold text-green-700">{money(latestPayment?.paid_amount || data.current_month_payment.paid_amount)}</span></p>
              <p className="border-t border-slate-200 pt-0.5 mt-0.5">
                <span className="text-slate-800 font-bold">Remaining:</span>
                <span className="font-bold text-rose-600 ml-1">{money(data.current_month_payment.remaining_amount)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="bg-slate-50 border border-slate-300 rounded p-2.5 mb-3">
          <p className="text-[11px] leading-snug">
            <span className="text-slate-600">Amount in words:</span>{' '}
            <span className="font-semibold text-slate-800">
              Rupees {numberToWords(latestPayment?.paid_amount || data.current_month_payment.paid_amount)} Only
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-20 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-500">Payment received successfully.</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Please keep this receipt for future reference.</p>
            </div>
            <div className="text-right">
              <div className="h-10" />
              <p className="text-[11px] font-semibold text-slate-700 border-t border-slate-400 pt-0.5">Cashier / Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Acknowledgment Slip (Student Copy) */}
        {/* <div className="border-t border-dashed border-slate-400 mt-3 pt-3">
          <p className="text-center text-[10px] text-slate-500 mb-2">✂ Cut here - Student Copy</p>
          <div className="border border-slate-300 rounded p-2.5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 text-[11px]">Payment Acknowledgment</h4>
                <p className="text-[11px] mt-1"><span className="text-slate-600">Receipt No:</span> <span className="font-semibold">{latestPayment?.receipt_no || "N/A"}</span></p>
                <p className="text-[11px]"><span className="text-slate-600">Student:</span> <span className="font-semibold">{data.student.name}</span></p>
                <p className="text-[11px]"><span className="text-slate-600">Class:</span> <span className="font-semibold">{data.student.class}-{data.student.section}</span></p>
              </div>
              <div className="text-right">
                <p className="text-[11px]"><span className="text-slate-600">Date:</span> <span className="font-semibold">{latestPayment?.date || new Date().toLocaleDateString()}</span></p>
                <p className="text-[11px]"><span className="text-slate-600">Month:</span> <span className="font-semibold">{data.current_month}</span></p>
                <p className="text-base font-bold text-green-700 mt-1">{money(latestPayment?.paid_amount || data.current_month_payment.paid_amount)}</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default function PrintReceipt({ data }: PrintReceiptProps) {
  return (
    <div className="flex w-full print:flex print:flex-row">
      <ReceiptContent data={data} />
      <ReceiptContent data={data} />
    </div>
  );
}