import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export data to PDF file
 * @param data - Array of objects
 * @param columns - Column config [{ key, label }]
 * @param title - PDF title & file name
 */
export const exportPDF = (
  data: any[],
  columns: { key: string; label: string }[],
  title: string
) => {
  const doc = new jsPDF({ orientation: "landscape" });

  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Prepare table columns
  const tableColumnHeaders = columns.map((col) => ({
    header: col.label,
    dataKey: col.key,
  }));

  // Generate PDF table
  autoTable(doc, {
    head: [tableColumnHeaders.map((c) => c.header)],
    body: data.map((row) =>
      tableColumnHeaders.map((c) => row[c.dataKey] || "")
    ),
    startY: 25,
    styles: { fontSize: 8, cellWidth: "wrap" },
  });

  // Save PDF
  doc.save(`${title}.pdf`);
};
