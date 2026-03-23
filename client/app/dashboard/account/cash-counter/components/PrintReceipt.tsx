import { FeeBillingResponse, PaymentHistory } from "../types/fee-billing";

interface PrintReceiptProps {
  data: FeeBillingResponse;
  selectedPayment: PaymentHistory | null;
}

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

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

const ReceiptContent = ({ data, selectedPayment }: PrintReceiptProps) => {
  const payment = selectedPayment || data.payment_history[0];

  const feeItems = Object.entries(data.fee_structure)
    .filter(([key, value]) => key !== "base_amount" && value > 0)
    .slice(0, 6);

  return (
    <div className="w-1/2 p-1.5 print:p-1.5">
      <div className="border border-gray-300 h-[720px] print:h-[720px] p-2 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-2 mb-2 relative">
          <img
            src="/salyansthan-logo.png"
            alt="School Logo"
            className="absolute left-2 top-1 w-10 h-10 object-contain"
          />

          <p className="text-[10px] italic text-slate-600">“Dedicated to Excellence”</p>

          <h1 className="text-[22px] font-bold text-slate-900 uppercase leading-tight">
            SALYANSTHAN SECONDARY SCHOOL
          </h1>

          <p className="text-[10px] text-slate-600 leading-tight">Kirtipur-4, Salyansthan, Kathmandu</p>
          <p className="text-[10px] text-slate-600 leading-tight">Email: schoolsalyansthan@gmail.com</p>
          <p className="text-[10px] text-slate-600 leading-tight">Phone: 01-5904264</p>

          <h2 className="text-[12px] font-bold text-slate-800 mt-2 uppercase bg-slate-100 py-1">
            Payment Receipt
          </h2>
        </div>

        {/* Receipt Info */}
        <div className="flex justify-between mb-2 text-[10px]">
          <div>
            <p>
              <span className="text-slate-600">Receipt No:</span>{" "}
              <span className="font-bold text-slate-800">{payment?.receipt_no || "N/A"}</span>
            </p>
            <p className="mt-0.5">
              <span className="text-slate-600">Date:</span>{" "}
              <span className="font-semibold">
                {payment?.date || new Date().toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p>
              <span className="text-slate-600">Academic Year:</span>{" "}
              <span className="font-semibold">{data.academic_year}</span>
            </p>
            <p className="mt-0.5">
              <span className="text-slate-600">Month:</span>{" "}
              <span className="font-semibold">{data.current_month}</span>
            </p>
          </div>
        </div>

        {/* Student Info */}
        <div className="border border-slate-300 rounded p-2 mb-2">
          <h3 className="font-bold text-slate-800 mb-1 text-[10px] uppercase">
            Student Details
          </h3>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p>
                <span className="text-slate-600">Name:</span>{" "}
                <span className="font-semibold">{data.student.name}</span>
              </p>
              <p className="mt-0.5">
                <span className="text-slate-600">Admission No:</span>{" "}
                <span className="font-semibold">{data.student.admission_no}</span>
              </p>
            </div>

            <div>
              <p>
                <span className="text-slate-600">Class:</span>{" "}
                <span className="font-semibold">
                  {data.student.class} - {data.student.section}
                </span>
              </p>
              <p className="mt-0.5">
                <span className="text-slate-600">Roll No:</span>{" "}
                <span className="font-semibold">{data.student.roll_no}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-2">
          <h3 className="font-bold text-slate-800 mb-1 text-[10px] uppercase">
            Payment Details
          </h3>

          <table className="w-full text-[10px] border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left py-1 px-2 border-b">Description</th>
                <th className="text-right py-1 px-2 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeItems.map(([key, value]) => (
                <tr key={key}>
                  <td className="py-1 px-2 border-b">
                    {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </td>
                  <td className="py-1 px-2 text-right border-b">
                    {money(value as number)}
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-50 font-semibold">
                <td className="py-1 px-2 border-b">Sub Total</td>
                <td className="py-1 px-2 text-right border-b">
                  {money(data.fee_structure.base_amount)}
                </td>
              </tr>

              {data.discount.amount > 0 && (
                <tr className="text-green-700">
                  <td className="py-1 px-2 border-b">Discount ({data.discount.type})</td>
                  <td className="py-1 px-2 text-right border-b">
                    - {money(data.discount.amount)}
                  </td>
                </tr>
              )}

              {data.previous_due.total_due > 0 && (
                <tr className="text-amber-700">
                  <td className="py-1 px-2 border-b">Previous Due</td>
                  <td className="py-1 px-2 text-right border-b">
                    + {money(data.previous_due.total_due)}
                  </td>
                </tr>
              )}

              <tr className="bg-slate-100 font-semibold">
                <td className="py-1 px-2 border-b">Total Payable</td>
                <td className="py-1 px-2 text-right border-b">
                  {money(data.current_month_payment.total_payable)}
                </td>
              </tr>

              <tr className="bg-green-50 font-bold text-green-800">
                <td className="py-1.5 px-2">Amount Paid</td>
                <td className="py-1.5 px-2 text-right text-[16px]">
                  {money(payment?.paid_amount || data.current_month_payment.paid_amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="border border-slate-300 rounded p-2 text-[10px]">
            <h4 className="font-bold text-slate-800 mb-1">Payment Info</h4>
            <p>
              <span className="text-slate-600">Method:</span>{" "}
              <span className="font-semibold">{payment?.method || "Cash"}</span>
            </p>
            <p>
              <span className="text-slate-600">Status:</span>{" "}
              <span className="font-semibold">{data.current_month_payment.status}</span>
            </p>
            <p>
              <span className="text-slate-600">Date:</span>{" "}
              <span className="font-semibold">
                {payment?.date || new Date().toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="border border-slate-300 rounded p-2 text-[10px]">
            <h4 className="font-bold text-slate-800 mb-1">Balance Info</h4>
            <p>
              <span className="text-slate-600">Total:</span>{" "}
              <span className="font-semibold">
                {money(data.current_month_payment.total_payable)}
              </span>
            </p>
            <p>
              <span className="text-slate-600">Paid:</span>{" "}
              <span className="font-semibold text-green-700">
                {money(payment?.paid_amount || data.current_month_payment.paid_amount)}
              </span>
            </p>
            <p className="font-bold text-rose-600">
              Due: {money(data.current_month_payment.remaining_amount)}
            </p>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="bg-slate-50 border border-slate-300 rounded p-2 mb-2">
          <p className="text-[10px] leading-snug">
            <span className="text-slate-600">In words:</span>{" "}
            <span className="font-semibold text-slate-800">
              Rupees {numberToWords(payment?.paid_amount || data.current_month_payment.paid_amount)} Only
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-3 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] text-slate-500">
                Payment received successfully.
              </p>
              <p className="text-[9px] text-slate-500">
                Keep this receipt for future reference.
              </p>
            </div>

            <div className="text-right">
              <div className="h-8" />
              <p className="text-[10px] border-t border-slate-400">
                Cashier / Authorized Signature
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function PrintReceipt({ data, selectedPayment }: PrintReceiptProps) {
  return (
    <div className="flex w-full print:flex print:flex-row">
      <ReceiptContent data={data} selectedPayment={selectedPayment} />
      <ReceiptContent data={data} selectedPayment={selectedPayment} />
    </div>
  );
}