using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IInvoicePdfService
    {
        /// <summary>
        /// Generates a PDF bill for a student for a specific month.
        /// </summary>
        Task<byte[]> GenerateBillPdfAsync(
            int  studentId,
            int? month          = null,
            int? academicYearId = null);

        /// <summary>
        /// Generates a PDF receipt for a specific payment.
        /// </summary>
        Task<byte[]> GenerateReceiptPdfAsync(int studentId, int paymentId);
    }
}
