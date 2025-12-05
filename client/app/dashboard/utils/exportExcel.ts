import * as XLSX from "xlsx";

export const exportExcel = (htmlContent: string, fileName: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  const table = tempDiv.querySelector("table");
  if (!table) {
    console.warn("No table found in HTML");
    return;
  }

  const columnCount = table.rows[0].cells.length;

  // Letterhead text
  const letterheadText = [
    "Salyansthan Secondary School",
    "“Dedicated to Excellence”",
    "Kirtipur-4, Salyansthan, Kathmandu",
    "Email: schoolsalyansthan@gmail.com | Phone: 01-5904264"
  ].join("\n");

  const ws: XLSX.WorkSheet = {};
  const data: any[][] = []; // <-- Fix: explicitly 2D array

  // Letterhead row
  const letterheadRow = new Array(columnCount).fill('');
  letterheadRow[0] = letterheadText;
  data.push(letterheadRow);

  // Empty row after letterhead
  data.push(new Array(columnCount).fill(''));

  // Convert table to array and add it
  const tableData = XLSX.utils.table_to_sheet(table);
  const tableArray = XLSX.utils.sheet_to_json(tableData, { header: 1 }) as any[][];
  data.push(...tableArray);

  // Add data to worksheet
  XLSX.utils.sheet_add_aoa(ws, data, { origin: "A1" });

  // Merge letterhead cell
  ws["!merges"] = ws["!merges"] || [];
  ws["!merges"].push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: columnCount - 1 }
  });

  // Style letterhead
  const letterheadCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  ws[letterheadCell] = ws[letterheadCell] || { t: 's', v: letterheadText };
  ws[letterheadCell].s = {
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    font: { bold: true, sz: 14, color: { rgb: "000000" } }
  };

  // Style header row (first row of table, after letterhead and empty row)
  const headerRowIndex = 2; // 0=letterhead, 1=empty, 2=table header
  for (let c = 0; c < columnCount; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c });
    if (ws[cellAddress]) {
      ws[cellAddress].s = ws[cellAddress].s || {};
      ws[cellAddress].s.font = { bold: true };
      ws[cellAddress].s.alignment = { horizontal: "center", vertical: "center" };
    }
  }

  // Row heights
  ws["!rows"] = ws["!rows"] || [];
  ws["!rows"][0] = { hpt: 80, hpx: 107 };
  ws["!rows"][1] = { hpt: 20, hpx: 27 };

  // Column widths
  ws["!cols"] = [];
  for (let i = 0; i < columnCount; i++) {
    ws["!cols"][i] = { wch: 20 };
  }

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
