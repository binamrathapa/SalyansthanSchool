import { FeeBillingResponse } from "../types/fee-billing";

interface PrintBillProps {
  data: FeeBillingResponse;
}

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function PrintBill({ data }: PrintBillProps) {
  return (
    <div className="p-8 bg-white min-h-screen" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ABC School</h1>
        <p className="text-sm text-slate-600">123 Education Street, City, State - 123456</p>
        <p className="text-sm text-slate-600">Phone: +91 1234567890 | Email: info@abcschool.edu</p>
        <h2 className="text-lg font-bold text-slate-800 mt-3 uppercase tracking-wide">Fee Bill</h2>
      </div>

      {/* Student Info & Bill Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">Student Information</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-slate-600">Name:</td>
                <td className="py-1 font-semibold text-slate-800">{data.student.name}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Admission No:</td>
                <td className="py-1 font-semibold text-slate-800">{data.student.admission_no}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Class & Section:</td>
                <td className="py-1 font-semibold text-slate-800">{data.student.class} - {data.student.section}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Roll No:</td>
                <td className="py-1 font-semibold text-slate-800">{data.student.roll_no}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">Bill Information</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-slate-600">Academic Year:</td>
                <td className="py-1 font-semibold text-slate-800">{data.academic_year}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Billing Month:</td>
                <td className="py-1 font-semibold text-slate-800">{data.current_month}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Bill Date:</td>
                <td className="py-1 font-semibold text-slate-800">{new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">Status:</td>
                <td className="py-1 font-semibold text-slate-800">{data.current_month_payment.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">Fee Breakdown</h3>
        <table className="w-full text-sm border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left py-2 px-3 border-b border-slate-300">Description</th>
              <th className="text-right py-2 px-3 border-b border-slate-300">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-3 border-b border-slate-200">Tuition Fee</td>
              <td className="py-2 px-3 border-b border-slate-200 text-right">{money(data.fee_structure.tuition_fee)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 border-b border-slate-200">Exam Fee</td>
              <td className="py-2 px-3 border-b border-slate-200 text-right">{money(data.fee_structure.exam_fee)}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 border-b border-slate-200">Transport Fee</td>
              <td className="py-2 px-3 border-b border-slate-200 text-right">{money(data.fee_structure.transport_fee)}</td>
            </tr>
            {data.fee_structure.hostel_fee > 0 && (
              <tr>
                <td className="py-2 px-3 border-b border-slate-200">Hostel Fee</td>
                <td className="py-2 px-3 border-b border-slate-200 text-right">{money(data.fee_structure.hostel_fee)}</td>
              </tr>
            )}
            <tr>
              <td className="py-2 px-3 border-b border-slate-200">Library Fee</td>
              <td className="py-2 px-3 border-b border-slate-200 text-right">{money(data.fee_structure.library_fee)}</td>
            </tr>
            <tr className="bg-slate-50 font-semibold">
              <td className="py-2 px-3 border-b border-slate-300">Sub Total</td>
              <td className="py-2 px-3 border-b border-slate-300 text-right">{money(data.fee_structure.base_amount)}</td>
            </tr>
            {data.discount.amount > 0 && (
              <tr className="text-green-700">
                <td className="py-2 px-3 border-b border-slate-200">Discount ({data.discount.type})</td>
                <td className="py-2 px-3 border-b border-slate-200 text-right">- {money(data.discount.amount)}</td>
              </tr>
            )}
            {data.previous_due.total_due > 0 && (
              <tr className="text-amber-700">
                <td className="py-2 px-3 border-b border-slate-200">Previous Due</td>
                <td className="py-2 px-3 border-b border-slate-200 text-right">+ {money(data.previous_due.total_due)}</td>
              </tr>
            )}
            <tr className="bg-slate-800 text-white font-bold">
              <td className="py-3 px-3">Total Payable</td>
              <td className="py-3 px-3 text-right">{money(data.current_month_payment.total_payable)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border border-slate-300 rounded p-4">
          <h4 className="font-bold text-slate-800 mb-2">Payment Status</h4>
          <div className="flex justify-between py-1">
            <span className="text-slate-600">Total Payable:</span>
            <span className="font-semibold">{money(data.current_month_payment.total_payable)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-600">Paid Amount:</span>
            <span className="font-semibold text-green-700">{money(data.current_month_payment.paid_amount)}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-slate-200 mt-2 pt-2">
            <span className="font-bold text-slate-800">Remaining:</span>
            <span className="font-bold text-rose-600">{money(data.current_month_payment.remaining_amount)}</span>
          </div>
        </div>

        <div className="border border-slate-300 rounded p-4">
          <h4 className="font-bold text-slate-800 mb-2">Year Summary</h4>
          <div className="flex justify-between py-1">
            <span className="text-slate-600">Total Year Fee:</span>
            <span className="font-semibold">{money(data.year_summary.total_year_fee)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-600">Total Discount:</span>
            <span className="font-semibold text-green-700">{money(data.year_summary.total_discount)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-600">Total Paid:</span>
            <span className="font-semibold text-blue-700">{money(data.year_summary.total_paid)}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-slate-200 mt-2 pt-2">
            <span className="font-bold text-slate-800">Total Due:</span>
            <span className="font-bold text-rose-600">{money(data.year_summary.total_due)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 pt-4 mt-8">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-slate-500">Note: Please pay the fee on or before the due date to avoid late fee charges.</p>
            <p className="text-xs text-slate-500 mt-1">This is a computer-generated bill.</p>
          </div>
          <div className="text-right">
            <div className="h-16"></div>
            <p className="text-sm font-semibold text-slate-700 border-t border-slate-400 pt-1">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
