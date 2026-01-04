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

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] InvoiceQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("Pagination error: PageNumber and PageSize must be at least 1.");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost("generate-monthly")]
        public async Task<IActionResult> Generate([FromBody] GenerateInvoiceDto dto)
        {
            try
            {
                int count = await _service.GenerateMonthlyInvoicesAsync(dto);
                return Ok(new { Message = "Process Completed", InvoicesCreated = count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("pay")]
        public async Task<IActionResult> PostPayment([FromBody] PaymentRequestDto dto)
        {
            // Note: Validation is handled automatically via FluentValidation 
            // registered in Program.cs
            var success = await _service.ProcessPaymentAsync(dto);

            if (!success)
                return BadRequest(new { Message = "Payment failed. Please verify Invoice ID and amount." });

            return Ok(new { Message = "Payment recorded successfully and invoice status updated." });
        }
    }
}