using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Invoice;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _service;

        public InvoiceController(IInvoiceService service)
        {
            _service = service;
        }

        /// <summary>
        /// Fetches list of invoices with pagination and filters (StudentId, Status, InvoiceNo)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] InvoiceQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("Pagination error: PageNumber and PageSize must be at least 1.");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        /// <summary>
        /// Gets detailed information for a specific invoice
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        /// <summary>
        /// Triggers the bulk generation for a specific month (Handles Monthly + One-Time Fees + Carry Forward)
        /// </summary>
        [HttpPost("generate-monthly")]
        public async Task<IActionResult> Generate([FromBody] GenerateInvoiceDto dto)
        {
            try
            {
                int count = await _service.GenerateMonthlyInvoicesAsync(dto);
                return Ok(new
                {
                    Message = "Generation Process Completed",
                    InvoicesCreated = count,
                    BillingMonth = dto.BillingMonth
                });
            }
            catch (Exception ex)
            {
                // Error might occur if FeeHeadId for Carry Forward is missing or DB constraints fail
                return BadRequest(new { Error = "Generation failed", Details = ex.Message });
            }
        }

        /// <summary>
        /// Records a payment. This will fail if the invoice is already marked as 'Paid' (Lock Feature)
        /// </summary>
        [HttpPost("pay")]
        public async Task<IActionResult> PostPayment([FromBody] PaymentRequestDto dto)
        {
            var success = await _service.ProcessPaymentAsync(dto);

            if (!success)
            {
                return BadRequest(new
                {
                    Message = "Payment rejected. Possible reasons: Invoice is already PAID, invoice does not exist, or internal database error."
                });
            }

            return Ok(new { Message = "Payment recorded successfully. Invoice status has been updated (Paid/Partial)." });
        }
    }
}