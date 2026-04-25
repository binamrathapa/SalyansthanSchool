using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SalyanthanSchool.WebAPI.Services.PdfDocuments;
using System.IO;

namespace SalyanthanSchool.WebAPI.Services.PdfDocuments
{
    public class BillDocument : IDocument
    {
        public PdfSchoolInfo SchoolInfo { get; }
        public PdfStudentInfo StudentInfo { get; }
        public PdfBillInfo BillInfo { get; }

        public BillDocument(PdfSchoolInfo school, PdfStudentInfo student, PdfBillInfo bill)
        {
            SchoolInfo = school;
            StudentInfo = student;
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
                        row.RelativeItem().PaddingRight(10).Element(ComposeBillPart);
                        row.ConstantItem(1).Background(Colors.Grey.Lighten2);
                        row.RelativeItem().PaddingLeft(10).Element(ComposeBillPart);
                    });
                });
        }

        void ComposeBillPart(IContainer container)
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

                column.Item().PaddingTop(5).BorderTop(1.5f).BorderBottom(1).PaddingVertical(2).AlignCenter().Text("FEE BILL").FontSize(9);

                // Metadata
                column.Item().PaddingTop(4).Row(row =>
                {
                    row.RelativeItem().Text(x => { x.Span("Bill Date: ").FontColor(Colors.Grey.Medium); x.Span(DateTime.Now.ToString("yyyy-MM-dd")); });
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

                // Fee Details
                column.Item().PaddingTop(10).Column(col =>
                {
                    col.Item().Text("FEE DETAILS").FontSize(8);
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

                        table.Cell().Padding(2).Text("Sub Total");
                        table.Cell().Padding(2).AlignRight().Text($"Rs. {BillInfo.TotalAmount:N0}");

                        if (BillInfo.Discount > 0)
                        {
                            table.Cell().Padding(2).Text("Discount").FontColor(Colors.Green.Medium);
                            table.Cell().Padding(2).AlignRight().Text($"- Rs. {BillInfo.Discount:N0}").FontColor(Colors.Green.Medium);
                        }

                        if (BillInfo.PreviousDue > 0)
                        {
                            table.Cell().Padding(2).Text("Previous Due").FontColor(Colors.Orange.Medium);
                            table.Cell().Padding(2).AlignRight().Text($"+ Rs. {BillInfo.PreviousDue:N0}").FontColor(Colors.Orange.Medium);
                        }

                        table.Cell().Background(Colors.Grey.Lighten4).Padding(3).Text("Total Payable");
                        table.Cell().Background(Colors.Grey.Lighten4).Padding(3).AlignRight().Text($"Rs. {BillInfo.PayableAmount:N0}");
                    });
                });

                // Summary
                column.Item().PaddingTop(10).Row(row =>
                {
                    row.RelativeItem().Border(0.5f).Padding(5).Column(col =>
                    {
                        col.Item().Text(x => { x.Span("Total: ").FontSize(8); x.Span($"Rs. {BillInfo.PayableAmount:N0}"); });
                        col.Item().Text(x => { x.Span("Paid: ").FontSize(8); x.Span($"Rs. {BillInfo.PaidAmount:N0}").FontColor(Colors.Green.Medium); });
                        col.Item().Text(x => { x.Span("Due: ").FontSize(8); x.Span($"Rs. {BillInfo.RemainingAmount:N0}").FontColor(Colors.Red.Medium); });
                    });
                    row.ConstantItem(10);
                    row.RelativeItem().Border(0.5f).Padding(5).Column(col =>
                    {
                        col.Item().Text(x => { x.Span("Year Total: ").FontSize(8); x.Span($"Rs. {BillInfo.YearSummary.TotalYearFee:N0}"); });
                        col.Item().Text(x => { x.Span("Discount: ").FontSize(8); x.Span($"Rs. {BillInfo.YearSummary.TotalDiscount:N0}"); });
                        col.Item().Text(x => { x.Span("Total Due: ").FontSize(8); x.Span($"Rs. {BillInfo.YearSummary.TotalDue:N0}"); });
                    });
                });

                // Footer
                column.Item().PaddingTop(20).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("Please pay before due date to avoid late charges.").FontSize(7).FontColor(Colors.Grey.Medium);
                        col.Item().Text("Keep this bill for future reference.").FontSize(7).FontColor(Colors.Grey.Medium);
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
