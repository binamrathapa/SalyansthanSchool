using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SalyanthanSchool.WebAPI.Services.PdfDocuments;
using System.IO;

namespace SalyanthanSchool.WebAPI.Services.PdfDocuments
{
    public class ReceiptDocument : IDocument
    {
        public PdfSchoolInfo SchoolInfo { get; }
        public PdfStudentInfo StudentInfo { get; }
        public PdfPaymentInfo PaymentInfo { get; }
        public PdfBillInfo BillInfo { get; }

        public ReceiptDocument(PdfSchoolInfo school, PdfStudentInfo student, PdfPaymentInfo payment, PdfBillInfo bill)
        {
            SchoolInfo = school;
            StudentInfo = student;
            PaymentInfo = payment;
            BillInfo = bill;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.Margin(15);
                    page.Size(PageSizes.A4.Landscape());
                    page.DefaultTextStyle(x => x.FontSize(8).FontFamily(Fonts.Arial).Weight(FontWeight.Normal));

                    page.Content().Row(row =>
                    {
                        row.RelativeItem().PaddingRight(10).Element(ComposeReceiptPart);
                        row.ConstantItem(1).Background(Colors.Grey.Lighten2);
                        row.RelativeItem().PaddingLeft(10).Element(ComposeReceiptPart);
                    });
                });
        }

        void ComposeReceiptPart(IContainer container)
        {
            container.Column(column =>
            {
                // Header
                column.Item().Row(row =>
                {
                    row.ConstantItem(50).Height(50).Element(e => {
                        string logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "students", "salyansthan-logo.png");
                        if (File.Exists(logoPath)) e.Image(logoPath);
                        else e.Border(1).BorderColor(Colors.Grey.Lighten1).AlignCenter().AlignMiddle().Text("LOGO").FontSize(6);
                    });

                    row.RelativeItem().AlignCenter().Column(col =>
                    {
                        col.Item().PaddingBottom(-2).Text("“Dedicated to Excellence”").FontSize(7).Italic().AlignCenter().FontColor(Colors.Grey.Medium);
                        col.Item().Text(SchoolInfo.Name.ToUpper()).FontSize(13).FontColor(Colors.Black);
                        col.Item().Text(SchoolInfo.Address).FontSize(8).AlignCenter().FontColor(Colors.Grey.Medium);
                        col.Item().Text($"Email: {SchoolInfo.Email}").FontSize(8).AlignCenter().FontColor(Colors.Grey.Medium);
                        col.Item().Text($"Phone: {SchoolInfo.Phone}").FontSize(8).AlignCenter().FontColor(Colors.Grey.Medium);
                    });
                });

                column.Item().PaddingTop(5).BorderTop(1.5f).BorderBottom(1).PaddingVertical(2).AlignCenter().Text("PAYMENT RECEIPT").FontSize(9);

                // Metadata
                column.Item().PaddingTop(4).Row(row =>
                {
                    row.RelativeItem().Column(c =>
                    {
                        c.Item().Text(x => { x.Span("Receipt No: ").FontColor(Colors.Grey.Medium); x.Span(PaymentInfo.ReceiptNo); });
                        c.Item().Text(x => { x.Span("Date: ").FontColor(Colors.Grey.Medium); x.Span(PaymentInfo.Date); });
                    });
                    row.RelativeItem().AlignRight().Column(c =>
                    {
                        c.Item().Text(x => { x.Span("Academic Year: ").FontColor(Colors.Grey.Medium); x.Span(BillInfo.AcademicYear); });
                        c.Item().Text(x => { x.Span("Month: ").FontColor(Colors.Grey.Medium); x.Span(BillInfo.MonthName); });
                    });
                });

                // Student Details
                column.Item().PaddingTop(10).Border(0.5f).BorderColor(Colors.Grey.Lighten1).Padding(5).Column(col =>
                {
                    col.Item().Text("STUDENT DETAILS").FontSize(8);
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text(x => { x.Span("Name: ").FontColor(Colors.Grey.Medium); x.Span(StudentInfo.Name); });
                            c.Item().Text(x => { x.Span("Admission No: ").FontColor(Colors.Grey.Medium); x.Span(StudentInfo.AdmissionNo); });
                        });
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text(x => { x.Span("Class: ").FontColor(Colors.Grey.Medium); x.Span($"{StudentInfo.Grade} - {StudentInfo.Section ?? "N/A"}"); });
                            c.Item().Text(x => { x.Span("Roll No: ").FontColor(Colors.Grey.Medium); x.Span(StudentInfo.RollNo.ToString()); });
                        });
                    });
                });

                // Payment Details
                column.Item().PaddingTop(10).Column(col =>
                {
                    col.Item().Text("PAYMENT DETAILS").FontSize(8);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(80);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten4).Padding(2).BorderBottom(0.5f).Text("Description");
                            header.Cell().Background(Colors.Grey.Lighten4).Padding(2).BorderBottom(0.5f).AlignRight().Text("Amount");
                        });

                        foreach (var item in BillInfo.Items)
                        {
                            table.Cell().BorderBottom(0.2f).BorderColor(Colors.Grey.Lighten3).Padding(1.5f).Text(item.Name);
                            table.Cell().BorderBottom(0.2f).BorderColor(Colors.Grey.Lighten3).Padding(1.5f).AlignRight().Text($"Rs. {item.Amount:N0}");
                        }

                        table.Cell().Padding(2).Text("Total Payable");
                        table.Cell().Padding(2).AlignRight().Text($"Rs. {BillInfo.PayableAmount:N0}");

                        table.Cell().Background(Colors.Green.Lighten5).Padding(3).Text("Amount Paid").FontColor(Colors.Green.Medium);
                        table.Cell().Background(Colors.Green.Lighten5).Padding(3).AlignRight().Text($"Rs. {PaymentInfo.PaidAmount:N0}").FontSize(12).FontColor(Colors.Green.Medium);
                    });
                });

                // Summary
                column.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem().Border(0.5f).Padding(5).Column(col =>
                    {
                        col.Item().Text("Payment Info").FontSize(8);
                        col.Item().Text(x => { x.Span("Method: ").FontSize(8); x.Span(PaymentInfo.Method); });
                        col.Item().Text(x => { x.Span("Status: ").FontSize(8); x.Span(PaymentInfo.Status); });
                    });
                    row.ConstantItem(10);
                    row.RelativeItem().Border(0.5f).Padding(5).Column(col =>
                    {
                        col.Item().Text("Balance Info").FontSize(8);
                        col.Item().Text(x => { x.Span("Total: ").FontSize(8); x.Span($"Rs. {BillInfo.PayableAmount:N0}"); });
                        col.Item().Text(x => { x.Span("Paid: ").FontSize(8); x.Span($"Rs. {PaymentInfo.PaidAmount:N0}"); });
                        col.Item().Text(x => { x.Span("Due: ").FontSize(8); x.Span($"Rs. {BillInfo.RemainingAmount:N0}").FontColor(Colors.Red.Medium); });
                    });
                });

                // Amount in Words
                column.Item().PaddingTop(10).Background(Colors.Grey.Lighten5).Border(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(4).Text(x =>
                {
                    x.Span("In words: ").FontColor(Colors.Grey.Medium);
                    x.Span($"Rupees {PaymentInfo.PaidAmountWords} Only");
                });

                // Footer
                column.Item().PaddingTop(20).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("Payment received successfully.").FontSize(7).FontColor(Colors.Grey.Medium);
                        col.Item().Text("Keep this receipt for future reference.").FontSize(7).FontColor(Colors.Grey.Medium);
                    });
                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().PaddingTop(8).BorderTop(0.5f).Text("Authorized Signature").FontSize(8).AlignCenter();
                    });
                });
            });
        }
    }
}
