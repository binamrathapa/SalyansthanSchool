import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
}

/* ------------------------------------------
   Excel Export (Reusable with Letterhead + Report Title + Auto SN)
------------------------------------------- */
export const exportExcel = async <T,>(
  data: T[],
  columns: ExportColumn<T>[],
  fileName = "export",
  reportTitle = "Student Details Report" // dynamic report title
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");

  const finalColumns = [{ key: "sn", label: "SN" }, ...columns];
  const lastCol = String.fromCharCode(64 + finalColumns.length);

  // School Name
  const schoolRow = sheet.addRow(["SALYANSTHAN SECONDARY SCHOOL"]);
  sheet.mergeCells(`A${schoolRow.number}:${lastCol}${schoolRow.number}`);
  schoolRow.font = { size: 18, bold: true };
  schoolRow.alignment = { horizontal: "center" };

  // Report title / dynamic description
  const reportRow = sheet.addRow([reportTitle]);
  sheet.mergeCells(`A${reportRow.number}:${lastCol}${reportRow.number}`);
  reportRow.font = { size: 14, bold: true };
  reportRow.alignment = { horizontal: "center" };

  // Address & contact
  const addressRow = sheet.addRow(["Kirtipur-4, Salyansthan, Kathmandu"]);
  sheet.mergeCells(`A${addressRow.number}:${lastCol}${addressRow.number}`);
  addressRow.font = { size: 12 };
  addressRow.alignment = { horizontal: "center" };

  const contactRow = sheet.addRow(["Email: schoolsalyansthan@gmail.com | Phone: 01-5904264"]);
  sheet.mergeCells(`A${contactRow.number}:${lastCol}${contactRow.number}`);
  contactRow.font = { size: 12 };
  contactRow.alignment = { horizontal: "center" };

  sheet.addRow([]); // empty row

  // Header row
  const headerRow = sheet.addRow(finalColumns.map(col => col.label));
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  // Data rows
  data.forEach((item, index) => {
    sheet.addRow([
      index + 1,
      ...columns.map(col => {
        const value = item[col.key as keyof T];
        if (typeof value === "string" && value.startsWith("/students")) return "";
        if (col.key === "rollNo") return Number(value);
        return value ?? "";
      }),
    ]);
  });

  // Auto column width
  finalColumns.forEach((col, idx) => {
    const texts = [
      col.label,
      ...data.map((item, i) =>
        idx === 0 ? (i + 1).toString() : String(item[col.key as keyof T] ?? "")
      ),
    ];
    const maxLength = Math.max(...texts.map(t => t.length));
    sheet.getColumn(idx + 1).width = Math.max(maxLength + 3, 8);
  });

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------------------
   PDF Export (Reusable with Letterhead + Report Title + Auto SN)
------------------------------------------- */
export const exportPDF = <T,>(
  data: T[],
  columns: ExportColumn<T>[],
  fileName = "export",
  reportTitle = "Student Details Report" // dynamic report title
) => {
  const doc = new jsPDF();

  // School name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SALYANSTHAN SECONDARY SCHOOL", 14, 20);

  // Report title / dynamic description
  doc.setFontSize(14);
  doc.text(reportTitle, 14, 28);

  // Address & contact
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Kirtipur-4, Salyansthan, Kathmandu", 14, 36);
  doc.text("Email: schoolsalyansthan@gmail.com | Phone: 01-5904264", 14, 42);

  // Table columns with SN
  const tableColumns = ["SN", ...columns.map(c => c.label)];
  const tableRows = data.map((item, index) => [
    index + 1,
    ...columns.map(col => {
      const value = item[col.key as keyof T];
      if (typeof value === "string" && value.startsWith("/students")) return "";
      if (col.key === "rollNo") return Number(value);
      return value ?? "";
    }),
  ]);

  // Table
  (doc as any).autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 50,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [30, 90, 200] },
  });

  doc.save(`${fileName}.pdf`);
};
