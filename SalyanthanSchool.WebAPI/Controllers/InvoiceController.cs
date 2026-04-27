using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Invoice;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _service;
        private readonly IInvoicePdfService _pdfService;
        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(
            IInvoiceService service,
            IInvoicePdfService pdfService,
            ILogger<InvoiceController> logger)
        {
            _service    = service;
            _pdfService = pdfService;
            _logger     = logger;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] InvoiceQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest(
                    ApiResponse<IEnumerable<InvoiceResponseDto>>.Fail(
                        "PageNumber and PageSize must be at least 1"));

            try
            {
                var result = await _service.GetAsync(query);
                var list   = result.ToList();

                return Ok(
                    ApiResponse<List<InvoiceResponseDto>>.Ok(
                        data: list,
                        message: "Invoices fetched successfully",
                        meta: new
                        {
                            pageNumber = query.PageNumber,
                            pageSize   = query.PageSize,
                            total      = list.Count
                        }
                    )
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching invoices");
                return StatusCode(500,
                    ApiResponse<List<InvoiceResponseDto>>.Fail(
                        ex.Message));
            }
        }

        // GET: api/Invoice/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);

                if (result == null)
                    return NotFound(
                        ApiResponse<InvoiceResponseDto>.Fail(
                            "Invoice not found"));

                return Ok(
                    ApiResponse<InvoiceResponseDto>.Ok(
                        result,
                        "Invoice fetched successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error fetching invoice {Id}", id);
                return StatusCode(500,
                    ApiResponse<InvoiceResponseDto>.Fail(
                        ex.Message));
            }
        }

        // POST: api/Invoice/generate-monthly/bulk
        [HttpPost("generate-monthly/bulk")]
        public async Task<IActionResult> GenerateBulk([FromBody] GenerateBulkInvoiceDto bulkDto)
        {
            var dto = new GenerateInvoiceDto
            {
                AcademicYearId = bulkDto.AcademicYearId,
                BillingMonth = bulkDto.BillingMonth,
                DueDate = bulkDto.DueDate,
                GradeId = bulkDto.GradeId
            };
            return await Generate(dto);
        }

        // POST: api/Invoice/generate-monthly/individual
        [HttpPost("generate-monthly/individual")]
        public async Task<IActionResult> GenerateIndividual([FromBody] GenerateInvoiceDto dto)
        {
            return await Generate(dto);
        }

        // POST: api/Invoice/generate-monthly
        [HttpPost("generate-monthly")]
        public async Task<IActionResult> Generate(
            [FromBody] GenerateInvoiceDto dto)
        {
            // Validate
            if (dto.BillingMonth < 1 || dto.BillingMonth > 12)
                return BadRequest(
                    ApiResponse<GenerateInvoiceResultDto>.Fail(
                        "BillingMonth must be between 1 and 12"));

            try
            {
                var result = await _service
                    .GenerateMonthlyInvoicesAsync(dto);

                // ✅ Return Fail if errors exist
                if (result.Errors.Any())
                {
                    return BadRequest(
                        ApiResponse<GenerateInvoiceResultDto>.Fail(
                            result,
                            result.Message,
                            new
                            {
                                invoicesCreated = result.InvoicesCreated,
                                invoicesSkipped = result.InvoicesSkipped,
                                errorsCount     = result.Errors.Count
                            }
                        )
                    );
                }

                // ✅ Return Fail if nothing happened
                if (result.InvoicesCreated == 0 && result.InvoicesSkipped == 0)
                {
                    return BadRequest(
                        ApiResponse<GenerateInvoiceResultDto>.Fail(
                            result,
                            "No invoices were generated. Check if students have assigned fees or valid custom items.",
                            new
                            {
                                invoicesCreated = result.InvoicesCreated,
                                invoicesSkipped = result.InvoicesSkipped
                            }
                        )
                    );
                }

                return Ok(
                    ApiResponse<GenerateInvoiceResultDto>.Ok(
                        result,
                        result.Message,
                        new
                        {
                            invoicesCreated = result.InvoicesCreated,
                            invoicesSkipped = result.InvoicesSkipped
                        }
                    )
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error generating invoices");
                return BadRequest(
                    ApiResponse<GenerateInvoiceResultDto>.Fail(
                        $"Generation failed: {ex.Message}"));
            }
        }

        // POST: api/Invoice/pay
        [HttpPost("pay")]
        public async Task<IActionResult> ProcessPayment(
            [FromBody] PaymentRequestDto dto)
        {
            // Validate
            if (dto.AmountPaid <= 0)
                return BadRequest(
                    ApiResponse<PaymentResultDto>.Fail(
                        "Amount must be greater than 0"));

            try
            {
                var result = await _service
                    .ProcessPaymentAsync(dto);

                if (!result.Success)
                    return BadRequest(
                        ApiResponse<PaymentResultDto>.Fail(
                            result,
                            result.Message));

                return Ok(
                    ApiResponse<PaymentResultDto>.Ok(
                        result,
                        result.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error processing payment for invoice {Id}",
                    dto.InvoiceId);
                return StatusCode(500,
                    ApiResponse<PaymentResultDto>.Fail(
                        ex.Message));
            }
        }

        // POST: api/Invoice/rollback/{invoiceId}
        [HttpPost("rollback/{invoiceId:int}")]
        public async Task<IActionResult> RollbackInvoice(
            int invoiceId,
            [FromBody] RollbackRequestDto dto)
        {
            try
            {
                var result = await _service
                    .RollbackInvoiceAsync(
                        invoiceId,
                        dto.Reason ?? "No reason provided");

                if (!result)
                    return BadRequest(
                        ApiResponse<bool>.Fail(
                            "Invoice rollback failed. " +
                            "Invoice may not exist, " +
                            "already cancelled, or has payments."));

                return Ok(
                    ApiResponse<bool>.Ok(
                        true,
                        $"Invoice {invoiceId} rolled back successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error rolling back invoice {Id}", invoiceId);
                return StatusCode(500,
                    ApiResponse<bool>.Fail(ex.Message));
            }
        }

        // POST: api/Invoice/rollback-payment/{paymentId}
        [HttpPost("rollback-payment/{paymentId:int}")]
        public async Task<IActionResult> RollbackPayment(
            int paymentId,
            [FromBody] RollbackRequestDto dto)
        {
            try
            {
                var result = await _service
                    .RollbackPaymentAsync(
                        paymentId,
                        dto.Reason ?? "No reason provided");

                if (!result)
                    return BadRequest(
                        ApiResponse<bool>.Fail(
                            "Payment rollback failed. " +
                            "Payment may not exist."));

                return Ok(
                    ApiResponse<bool>.Ok(
                        true,
                        $"Payment {paymentId} reversed successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error rolling back payment {Id}", paymentId);
                return StatusCode(500,
                    ApiResponse<bool>.Fail(ex.Message));
            }
        }

        // ── PDF: Download Fee Bill ──────────────────────────
        [HttpGet("{studentId:int}/bill-pdf")]
        public async Task<IActionResult> DownloadBillPdf(
            int studentId,
            [FromQuery] int? month          = null,
            [FromQuery] int? academicYearId = null)
        {
            try
            {
                var pdfBytes = await _pdfService
                    .GenerateBillPdfAsync(studentId, month, academicYearId);

                var fileName = $"FeeBill_{studentId}_{DateTime.Now:yyyyMMdd}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating bill PDF for student {Id}", studentId);
                return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
            }
        }

        // ── PDF: Download Payment Receipt ───────────────────
        [HttpGet("{studentId:int}/receipt-pdf/{paymentId:int}")]
        public async Task<IActionResult> DownloadReceiptPdf(
            int studentId,
            int paymentId)
        {
            try
            {
                var pdfBytes = await _pdfService
                    .GenerateReceiptPdfAsync(studentId, paymentId);

                var fileName = $"Receipt_{studentId}_{paymentId}_{DateTime.Now:yyyyMMdd}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating receipt PDF for student {Id}", studentId);
                return StatusCode(500, ApiResponse<string>.Fail(ex.Message));
            }
        }
    }

    // ── Rollback Request ───────────────────────────────────
    public class RollbackRequestDto
    {
        public string? Reason { get; set; }
    }
}