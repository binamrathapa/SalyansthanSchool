import { FeeBillingResponse } from "../types/fee-billing";

interface PrintBillProps {
  data: FeeBillingResponse;
}

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

const BillContent = ({ data }: PrintBillProps) => {
  return (
    <div className="w-1/2 p-2">
      <div className="border border-gray-300 h-full p-2 flex flex-col">

        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-3 mb-3 relative">
          <img
            src="/salyansthan-logo.png"
            alt="School Logo"
            className="absolute left-2 top-1 w-12 h-12 object-contain"
          />

          <p className="text-[11px] italic text-slate-600">“Dedicated to Excellence”</p>

          <h1 className="text-lg font-bold text-slate-900 uppercase">
            SALYANSTHAN SECONDARY SCHOOL
          </h1>

          <p className="text-[11px] text-slate-600">Kirtipur-4, Salyansthan, Kathmandu</p>
          <p className="text-[11px] text-slate-600">Email: schoolsalyansthan@gmail.com</p>
          <p className="text-[11px] text-slate-600">Phone: 01-5904264</p>

          <h2 className="text-sm font-bold text-slate-800 mt-2 uppercase bg-slate-100 py-1">
            Fee Bill
          </h2>
        </div>

        {/* Bill Info */}
        <div className="flex justify-between mb-3 text-[11px]">
          <div>
            <p>
              <span className="text-slate-600">Bill Date:</span>{" "}
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
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
        <div className="border border-slate-300 rounded p-2.5 mb-3">
          <h3 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase">
            Student Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
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

        {/* Fee Table */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase">
            Fee Details
          </h3>

          <table className="w-full text-[11px] border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left py-1 px-2 border-b">Description</th>
                <th className="text-right py-1 px-2 border-b">Amount</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(data.fee_structure)
                .filter(([key, value]) => key !== "base_amount" && value > 0)
                .map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-1 px-2 border-b"> {
                      key.replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    }</td>
                    <td className="py-1 px-2 text-right border-b">
                      {money(value as number)}
                    </td>
                  </tr>
                ))
              }

              <tr className="bg-slate-50 font-semibold">
                <td className="py-1 px-2 border-b">Sub Total</td>
                <td className="py-1 px-2 text-right border-b">{money(data.fee_structure.base_amount)}</td>
              </tr>

              {data.discount.amount > 0 && (
                <tr className="text-green-700">
                  <td className="py-1 px-2 border-b">Discount</td>
                  <td className="py-1 px-2 text-right border-b">- {money(data.discount.amount)}</td>
                </tr>
              )}

              {data.previous_due.total_due > 0 && (
                <tr className="text-amber-700">
                  <td className="py-1 px-2 border-b">Previous Due</td>
                  <td className="py-1 px-2 text-right border-b">+ {money(data.previous_due.total_due)}</td>
                </tr>
              )}

              <tr className="bg-slate-100 font-bold">
                <td className="py-1 px-2">Total Payable</td>
                <td className="py-1 px-2 text-right">{money(data.current_month_payment.total_payable)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border p-2 text-[11px]">
            <p>Total: <span className="font-semibold">{money(data.current_month_payment.total_payable)}</span></p>
            <p>Paid: <span className="font-semibold text-green-700">{money(data.current_month_payment.paid_amount)}</span></p>
            <p className="font-bold text-rose-600">
              Due: {money(data.current_month_payment.remaining_amount)}
            </p>
          </div>

          <div className="border p-2 text-[11px]">
            <p>Year Total: {money(data.year_summary.total_year_fee)}</p>
            <p>Discount: {money(data.year_summary.total_discount)}</p>
            <p className="font-bold">Total Due: {money(data.year_summary.total_due)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300 pt-6 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-500">
                Please pay before due date to avoid late charges.
              </p>
              <p className="text-[10px] text-slate-500">
                Keep this bill for future reference.
              </p>
            </div>

            <div className="text-right">
              <div className="h-10" />
              <p className="text-[11px] border-t border-slate-400">
                Authorized Signature
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function PrintBill({ data }: PrintBillProps) {
  return (
    <div className="flex w-full print:flex print:flex-row">
      <BillContent data={data} />
      <BillContent data={data} />
    </div>
  );
}